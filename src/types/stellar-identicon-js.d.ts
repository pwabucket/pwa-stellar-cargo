declare module "stellar-identicon-js/index" {
  interface IdenticonOptions {
    width?: number;
    height?: number;
  }

  export default function createStellarIdenticon(
    publicKey: string,
    options?: IdenticonOptions,
  ): HTMLCanvasElement;
}
