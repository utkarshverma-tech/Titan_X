/**
 * Titan X — generated from openapi.yaml.
 * Do not edit by hand; run codegen in @workspace/api-spec.
 */

export interface DetectFrameBody {
  /** Base64-encoded JPEG frame */
  imageBase64: string;
  cameraId?: string;
  /** Person count from client-side TensorFlow.js */
  clientPersonCount?: number;
}
