/* eslint-disable prettier/prettier */
import * as path from "path";
import * as zlib from "zlib";
import { PassThrough } from "stream";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as sharp from "sharp";
import * as serviceAccount from "./serviceAccount.json";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    storageBucket: "app-reaproducao.appspot.com"
});

interface RequestParams {
    0?: string;
}

interface RequestQuery {
    w?: string;
    h?: string;
    q?: string;
    dpr?: string;
}

const SHARP_FORMATS = Object.values(sharp.format);
const SHARP_SUPPORTED_FORMATS = SHARP_FORMATS.filter(
    ({ input, output }) => input.buffer && output.buffer
).map(({ id }) => `image/${id}`);
// Lista de formatos suportados pelo Sharp e mapeia para o formato "image/*"

const FORMAT_WEBP = "image/webp";
// Define o formato WebP

const DEFAULT_MAX_AGE = "31536000";
const DEFAULT_CACHE_CONTROL = `public, max-age=${DEFAULT_MAX_AGE}, s-maxage=${DEFAULT_MAX_AGE}`;
// Define configurações padrão de cache

export const dynamicImages = functions.https.onRequest(async (request, response) => {

    const bucket = admin.storage().bucket();
    // Obtém o bucket de armazenamento do Firebase

    const {
        query,
        params,
    }: { query: RequestQuery; params: RequestParams } = request;
    const { 0: urlparam = "" } = params;

    const filepath = urlparam;
    // Remove a barra inicial da URL

    let width = query.w && parseInt(query.w);
    let height = query.h && parseInt(query.h);
    const quality = query.q && parseInt(query.q);
    const dpr = query.dpr && parseInt(query.dpr);
    // Converte parâmetros para números inteiros

    if (dpr && !isNaN(dpr)) {
        width = width && !isNaN(width) ? width * dpr : width;
        height = height && !isNaN(height) ? height * dpr : width;
    }
    // Calcula dimensões com base na resolução (dpr)


    if (!filepath || !filepath.length) {
        response.status(400).send('Filepath vazio');
        return;
    }
    // Retorna um erro 404 se não houver caminho de arquivo

    if (
        (width && isNaN(width as any)) ||
        (height && isNaN(height as any)) ||
        (quality && isNaN(quality as any))
    ) {
        response.status(400).send('Width ou height ou quality são nulos');
        return;
    }
    // Verifica se os parâmetros da solicitação são números válidos

    // Registra informações sobre a transformação a ser realizada
    const ref = bucket.file(filepath);
    const [isExists] = await ref.exists();
    // Obtém uma referência para o arquivo no bucket

    if (!isExists) {
        response.status(404).send('Erro no ref.exists');
        return;
    }

    const mimetypeImage = ref.metadata.contentType.replace('.', '/');

    const isSupportedBySharp = SHARP_SUPPORTED_FORMATS.includes(
        mimetypeImage
    );
    // Verifica se o Sharp aceita o tipo de conteúdo do arquivo

    const isTransformed = Boolean(
        isSupportedBySharp && (width || height || quality)
    );
    // Determina se uma transformação é necessária

    const isWebpTransform = !!request.accepts(FORMAT_WEBP) && isTransformed;
    // Determina o formato de saída, incluindo WebP, com base no cabeçalho "Accept" da solicitação

    const contentType = isWebpTransform ? FORMAT_WEBP : mimetypeImage;
    const sourceext = path.extname(ref.metadata.name);
    const filename = path.basename(ref.metadata.name, sourceext);
    // Define o tipo de conteúdo e o nome do arquivo de saída

    const dispositionfilename = isWebpTransform
        ? filename + ".webp"
        : filename + sourceext;
    // Cria a disposição de conteúdo

    const resizeOpts: any = { width, height, fit: "inside" };
    const formatOpts: any = { quality };
    const format = SHARP_FORMATS.find(
        (f) => f.id === contentType.replace("image/", "")
    );
    // Define opções para a biblioteca Sharp com base nos parâmetros da solicitação

    let encoder: zlib.BrotliCompress | zlib.Gzip | zlib.Deflate | PassThrough;
    let encodingAlogrithm: string | undefined;
    const encodingPreference = request.acceptsEncodings();
    // Configura a compressão com base nas preferências do cliente

    if (encodingPreference.includes("br")) {
        encoder = zlib.createBrotliCompress();
        encodingAlogrithm = "br";
    } else if (encodingPreference[0] === "gzip") {
        encoder = zlib.createGzip();
        encodingAlogrithm = "gzip";
    } else if (encodingPreference[0] === "deflate") {
        encoder = zlib.createDeflate();
        encodingAlogrithm = "deflate";
    } else encoder = new PassThrough();
    // Define o algoritmo de compressão com base nas preferências do cliente

    const cacheControl = DEFAULT_CACHE_CONTROL;
    const contentDisposition = `inline; filename=${dispositionfilename}`;
    const contentEncoding = encodingAlogrithm;
    const xIsTransformed = isTransformed.toString();
    const xGeneration = new Date().toISOString();
    // Define os cabeçalhos da resposta

    response.setHeader("x-gfn-istransformed", xIsTransformed);
    response.setHeader("x-gfn-generation", xGeneration);
    response.setHeader("Cache-Control", cacheControl);
    response.setHeader("Content-Disposition", contentDisposition);
    contentEncoding && response.setHeader("Content-Encoding", contentEncoding);
    response.contentType(contentType);
    // Define os cabeçalhos da resposta

    const pipeline = sharp();
    const destination = isTransformed ? pipeline : encoder;
    // Configura o pipeline de redimensionamento

    ref.createReadStream().pipe(destination);
    // Encaminha o conteúdo do arquivo para o destino

    if (isTransformed)
        pipeline.resize(resizeOpts).toFormat(format, formatOpts).pipe(encoder);
    // Se uma transformação for necessária, redimensiona a imagem

    encoder.pipe(response);
    // Encaminha a imagem final comprimida para a resposta
});