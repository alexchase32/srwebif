'use strict';

const ffi = require('@2060.io/ffi-napi');
const ref = require('@2060.io/ref-napi');

const voidPtr = ref.refType(ref.types.void);
const connectionPtr = voidPtr;
const questionPtr = voidPtr;
const questionSetPtr = voidPtr;

// Callback types
const sdkCallback = ffi.Function('void', [voidPtr]);
const clickerRespondedCallback = ffi.Function('void', ['string', 'string', 'string', voidPtr]);

const sdk = ffi.Library(
  'C:\\Program Files (x86)\\SMART Technologies\\SMART Response\\SMARTResponseSDK-2.0',
  {
    smartresponse_sdk_initialize: ['int', ['int']],
    smartresponse_sdk_terminate: ['void', []],
    smartresponse_connectionV1_create: [connectionPtr, ['int']],
    smartresponse_connectionV1_connect: ['void', [connectionPtr]],
    smartresponse_connectionV1_listenonconnected: [voidPtr, [connectionPtr, sdkCallback, voidPtr]],
    smartresponse_connectionV1_startclass: ['void', [connectionPtr]],
    smartresponse_connectionV1_startquestion: ['void', [connectionPtr, questionPtr]],
    smartresponse_connectionV1_listenonclickerresponded: [voidPtr, [connectionPtr, clickerRespondedCallback, voidPtr]],
    smartresponse_questionV1_create: [questionPtr, ['int', 'int']],
    smartresponse_questionV1_setquestiontext: ['void', [questionPtr, 'string', 'int']],
    smartresponse_questionV1_setanswer: ['void', [questionPtr, 'string', 'int']],
    smartresponse_questionsetV1_create: [questionSetPtr, []],
    smartresponse_questionsetV1_setquestion: ['void', [questionSetPtr, questionPtr, 'int']]
  }
);

// Export both the library and the clicker callback constructor
module.exports = { sdk, clickerRespondedCallback };
