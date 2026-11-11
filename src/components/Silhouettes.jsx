import React from 'react';

// Semua siluet digambar dari kode dalam ruang lokal, fill = currentColor.

// Perempuan berdiri, rambut & gaun tersapu angin (angin ke kanan)
export const WomanWind = ({hairSway = 0}) => (
  <g>
    <g transform={`rotate(${hairSway} 92 40)`}>
      <path d="M96 20 C118 14 140 24 152 42 C162 58 176 64 190 68 C176 76 158 72 147 61 C137 50 120 42 104 45 C97 46 90 38 96 20 Z" />
      <path d="M100 26 C114 27 127 37 133 51 C139 65 151 73 162 77 C149 81 136 75 128 63 C120 51 110 45 100 45 Z" />
    </g>
    <circle cx="92" cy="38" r="15" />
    <path d="M92 52 C83 60 80 72 83 88 C73 108 67 138 64 168 C58 224 50 292 38 348 C30 386 22 410 12 424 C66 416 104 402 130 382 C150 366 162 340 167 315 C155 321 143 325 133 327 C146 283 154 226 156 182 C158 138 152 98 138 74 C129 57 111 47 92 52 Z" />
  </g>
);

// Ratu bermahkota (depan), rambut panjang dua sisi
export const QueenFigure = ({hairSway = 0, gemColor = null}) => (
  <g>
    <path d="M66 14 L74 -6 L84 10 L95 -14 L106 10 L117 -6 L125 14 Z" />
    {gemColor ? (
      <>
        <circle cx="74" cy="-6" r="4" fill={gemColor} />
        <circle cx="95" cy="-14" r="4.6" fill={gemColor} />
        <circle cx="117" cy="-6" r="4" fill={gemColor} />
      </>
    ) : null}
    <g transform={`rotate(${hairSway} 95 40)`}>
      <path d="M80 26 C60 34 48 56 44 86 C40 116 32 146 22 168 C36 160 48 142 55 118 C62 92 70 66 84 52 Z" />
      <path d="M110 26 C130 34 142 56 146 86 C150 116 158 146 168 168 C154 160 142 142 135 118 C128 92 120 66 106 52 Z" />
    </g>
    <circle cx="95" cy="36" r="17" />
    <path d="M78 56 C70 62 66 74 64 90 C56 130 46 200 36 272 C28 330 20 376 12 404 C56 398 92 390 122 382 C150 374 172 362 184 348 C170 350 156 350 144 348 C154 288 162 210 164 150 C165 110 160 78 148 60 C138 50 120 44 108 46 C96 42 84 46 78 56 Z" />
  </g>
);

// Pejalan (profil samping) dengan langkah kaki & ayunan tangan
export const Walker = ({step = 0}) => (
  <g>
    <circle cx="46" cy="22" r="10" />
    <path d="M42 32 C36 40 34 52 36 64 C30 84 28 104 30 122 L60 122 C62 104 60 84 56 64 C58 52 54 40 50 34 Z" />
    <g transform={`rotate(${step} 44 120)`}>
      <path d="M38 118 L48 118 L52 200 L36 200 Z" />
    </g>
    <g transform={`rotate(${-step} 44 120)`}>
      <path d="M40 118 L50 118 L46 200 L30 200 Z" />
    </g>
    <g transform={`rotate(${-step * 0.8} 46 60)`}>
      <path d="M42 58 L50 58 L48 112 L40 112 Z" />
    </g>
  </g>
);

// Puncak ombak (untuk takhta ratu)
export const WaveCrest = () => <path d="M0 120 C120 60 240 44 360 64 C420 74 470 96 520 120 L520 200 L0 200 Z" />;
