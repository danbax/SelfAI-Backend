// polyfill.ts

if (typeof globalThis.ReadableStream === 'undefined') {
  const { ReadableStream, WritableStream, TransformStream } = require('stream/web');

  globalThis.ReadableStream = ReadableStream;
  globalThis.WritableStream = WritableStream;
  globalThis.TransformStream = TransformStream;

  // Optional: Polyfill queuing strategies if needed
  const {
    ByteLengthQueuingStrategy,
    CountQueuingStrategy,
  } = require('web-streams-polyfill/polyfill');

  globalThis.ByteLengthQueuingStrategy = ByteLengthQueuingStrategy;
  globalThis.CountQueuingStrategy = CountQueuingStrategy;
}
