import React from 'react'
import {HUB_AUTHOR_IMAGE_SPECS} from '../schemaTypes/constants'

export type ImageUploadSpec = {
  note: string
  design: string
  aspect: string
  recommended: string
}

type ImageUploadGuidanceProps = {
  spec: ImageUploadSpec
  extra?: React.ReactNode
}

export function ImageUploadGuidance({spec, extra}: ImageUploadGuidanceProps) {
  return (
    <span style={{display: 'block', lineHeight: 1.55}}>
      {spec.note}{' '}
      <strong>Design size (1×):</strong> <strong>{spec.design} px</strong> ·{' '}
      <strong>aspect {spec.aspect}</strong>. <strong>Recommended upload:</strong>{' '}
      <strong>{spec.recommended} px or larger</strong>. <strong>Larger files are fine</strong>{' '}
      (CDN downscales). <strong>Smaller may look soft</strong> when stretched. Wrong aspect ratio
      is cropped — <strong>set hotspot</strong> on the image if needed.
      {extra ? (
        <>
          {' '}
          {extra}
        </>
      ) : null}
    </span>
  )
}

export function imageUploadGuidance(spec: ImageUploadSpec, extra?: React.ReactNode) {
  return <ImageUploadGuidance spec={spec} extra={extra} />
}

export function authorPhotoUploadGuidance() {
  const extra = (
    <>
      <strong>Square 1:1</strong> uploads are OK — face stays top-aligned. Use{' '}
      <strong>crop/hotspot</strong> on the face for precise framing.
    </>
  )

  return imageUploadGuidance(HUB_AUTHOR_IMAGE_SPECS, extra)
}
