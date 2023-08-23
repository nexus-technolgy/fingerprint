export const parameterNames = [
  "ACTIVE_TEXTURE",
  "ALIASED_LINE_WIDTH_RANGE",
  "ALIASED_POINT_SIZE_RANGE",
  "ALPHA_BITS",
  "ARRAY_BUFFER_BINDING",
  "BLEND",
  "BLEND_COLOR",
  "BLEND_DST_ALPHA",
  "BLEND_DST_RGB",
  "BLEND_EQUATION",
  "BLEND_EQUATION_ALPHA",
  "BLEND_EQUATION_RGB",
  "BLEND_SRC_ALPHA",
  "BLEND_SRC_RGB",
  "BLUE_BITS",
  "COLOR_CLEAR_VALUE",
  "COLOR_WRITEMASK",
  "COMPRESSED_TEXTURE_FORMATS",
  "CULL_FACE",
  "CULL_FACE_MODE",
  "CURRENT_PROGRAM",
  "DEPTH_BITS",
  "DEPTH_CLEAR_VALUE",
  "DEPTH_FUNC",
  "DEPTH_RANGE",
  "DEPTH_TEST",
  "DEPTH_WRITEMASK",
  "DITHER",
  "ELEMENT_ARRAY_BUFFER_BINDING",
  "FRAMEBUFFER_BINDING",
  "FRONT_FACE",
  "GENERATE_MIPMAP_HINT",
  "GREEN_BITS",
  "IMPLEMENTATION_COLOR_READ_FORMAT",
  "IMPLEMENTATION_COLOR_READ_TYPE",
  "LINE_WIDTH",
  "MAX_COMBINED_TEXTURE_IMAGE_UNITS",
  "MAX_CUBE_MAP_TEXTURE_SIZE",
  "MAX_FRAGMENT_UNIFORM_VECTORS",
  "MAX_RENDERBUFFER_SIZE",
  "MAX_TEXTURE_IMAGE_UNITS",
  "MAX_TEXTURE_SIZE",
  "MAX_VARYING_VECTORS",
  "MAX_VERTEX_ATTRIBS",
  "MAX_VERTEX_TEXTURE_IMAGE_UNITS",
  "MAX_VERTEX_UNIFORM_VECTORS",
  "MAX_VIEWPORT_DIMS",
  "PACK_ALIGNMENT",
  "POLYGON_OFFSET_FACTOR",
  "POLYGON_OFFSET_FILL",
  "POLYGON_OFFSET_UNITS",
  "RED_BITS",
  "RENDERBUFFER_BINDING",
  "SAMPLE_BUFFERS",
  "SAMPLE_COVERAGE_INVERT",
  "SAMPLE_COVERAGE_VALUE",
  "SAMPLES",
  "SCISSOR_BOX",
  "SCISSOR_TEST",
  "STENCIL_BACK_FAIL",
  "STENCIL_BACK_FUNC",
  "STENCIL_BACK_PASS_DEPTH_FAIL",
  "STENCIL_BACK_PASS_DEPTH_PASS",
  "STENCIL_BACK_REF",
  "STENCIL_BACK_VALUE_MASK",
  "STENCIL_BACK_WRITEMASK",
  "STENCIL_BITS",
  "STENCIL_CLEAR_VALUE",
  "STENCIL_FAIL",
  "STENCIL_FUNC",
  "STENCIL_PASS_DEPTH_FAIL",
  "STENCIL_PASS_DEPTH_PASS",
  "STENCIL_REF",
  "STENCIL_TEST",
  "STENCIL_VALUE_MASK",
  "STENCIL_WRITEMASK",
  "SUBPIXEL_BITS",
  "TEXTURE_BINDING_2D",
  "TEXTURE_BINDING_CUBE_MAP",
  "UNPACK_ALIGNMENT",
  "UNPACK_COLORSPACE_CONVERSION_WEBGL",
  "UNPACK_FLIP_Y_WEBGL",
  "UNPACK_PREMULTIPLY_ALPHA_WEBGL",
  "VIEWPORT",
];

export const extensionList = {
  WEBGL_compressed_texture_s3tc: [
    "COMPRESSED_RGB_S3TC_DXT1_EXT",
    "COMPRESSED_RGBA_S3TC_DXT1_EXT",
    "COMPRESSED_RGBA_S3TC_DXT3_EXT",
    "COMPRESSED_RGBA_S3TC_DXT5_EXT",
  ],
  WEBGL_compressed_texture_s3tc_srgb: [
    "COMPRESSED_SRGB_S3TC_DXT1_EXT",
    "COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT",
    "COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT",
    "COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT",
  ],
  WEBGL_compressed_texture_etc: [
    "COMPRESSED_R11_EAC",
    "COMPRESSED_SIGNED_R11_EAC",
    "COMPRESSED_RG11_EAC",
    "COMPRESSED_SIGNED_RG11_EAC",
    "COMPRESSED_RGB8_ETC2",
    "COMPRESSED_RGBA8_ETC2_EAC",
    "COMPRESSED_SRGB8_ETC2",
    "COMPRESSED_SRGB8_ALPHA8_ETC2_EAC",
    "COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2",
    "COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2",
  ],
  WEBGL_compressed_texture_pvrtc: [
    "COMPRESSED_RGB_PVRTC_4BPPV1_IMG",
    "COMPRESSED_RGBA_PVRTC_4BPPV1_IMG",
    "COMPRESSED_RGB_PVRTC_2BPPV1_IMG",
    "COMPRESSED_RGBA_PVRTC_2BPPV1_IMG",
  ],
  WEBGL_compressed_texture_etc1: ["COMPRESSED_RGB_ETC1_WEBGL"],
  WEBGL_compressed_texture_atc: [
    "COMPRESSED_RGB_ATC_WEBGL",
    "COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL",
    "COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL",
  ],
  WEBGL_compressed_texture_astc: [
    "COMPRESSED_RGBA_ASTC_4x4_KHR",
    "COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR",
    "COMPRESSED_RGBA_ASTC_5x4_KHR",
    "COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR",
    "COMPRESSED_RGBA_ASTC_5x5_KHR",
    "COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR",
    "COMPRESSED_RGBA_ASTC_6x5_KHR",
    "COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR",
    "COMPRESSED_RGBA_ASTC_6x6_KHR",
    "COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR",
    "COMPRESSED_RGBA_ASTC_8x5_KHR",
    "COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR",
    "COMPRESSED_RGBA_ASTC_8x6_KHR",
    "COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR",
    "COMPRESSED_RGBA_ASTC_8x8_KHR",
    "COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR",
    "COMPRESSED_RGBA_ASTC_10x5_KHR",
    "COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR",
    "COMPRESSED_RGBA_ASTC_10x6_KHR",
    "COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR",
    "COMPRESSED_RGBA_ASTC_10x6_KHR",
    "COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR",
    "COMPRESSED_RGBA_ASTC_10x10_KHR",
    "COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR",
    "COMPRESSED_RGBA_ASTC_12x10_KHR",
    "COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR",
    "COMPRESSED_RGBA_ASTC_12x12_KHR",
    "COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR",
  ],
  ANGLE_instanced_arrays: ["VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE"],
  EXT_blend_minmax: ["MIN_EXT", "MAX_EXT"],
  EXT_color_buffer_half_float: [
    "RGBA16F_EXT",
    "RGB16F_EXT",
    "FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE_EXT",
    "UNSIGNED_NORMALIZED_EXT",
  ],
  EXT_disjoint_timer_query: ["GPU_DISJOINT_EXT"],
  EXT_sRGB: ["SRGB_EXT", "SRGB_ALPHA_EXT", "SRGB8_ALPHA8_EXT", "FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING_EXT"],
  EXT_texture_filter_anisotropic: ["MAX_TEXTURE_MAX_ANISOTROPY_EXT", "TEXTURE_MAX_ANISOTROPY_EXT"],
  OES_standard_derivatives: ["FRAGMENT_SHADER_DERIVATIVE_HINT_OES"],
  OES_texture_half_float: ["HALF_FLOAT_OES"],
  OES_vertex_array_object: ["VERTEX_ARRAY_BINDING_OES"],
  WEBGL_color_buffer_float: [
    "RGBA32F_EXT",
    "RGB32F_EXT",
    "FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE_EXT",
    "UNSIGNED_NORMALIZED_EXT",
  ],
  WEBGL_depth_texture: ["UNSIGNED_INT_24_8_WEBGL"],
  WEBGL_draw_buffers: [
    "COLOR_ATTACHMENT0_WEBGL",
    "COLOR_ATTACHMENT1_WEBGL",
    "COLOR_ATTACHMENT15_WEBGL",
    "DRAW_BUFFER0_WEBGL",
    "DRAW_BUFFER1_WEBGL",
    "DRAW_BUFFER15_WEBGL",
    "MAX_COLOR_ATTACHMENTS_WEBGL",
    "MAX_DRAW_BUFFERS_WEBGL",
  ],
};
