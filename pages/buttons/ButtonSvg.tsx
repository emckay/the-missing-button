export type ButtonSvgProps = {
  rimColor: string;
  baseColor: string;
  holes: "two" | "four";
  rimWidth: number;
  shape: "square" | "round";
};

export const ButtonSvg = (props: ButtonSvgProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={100} height={100} fill="none">
    <defs>
      <clipPath id="square-clipper">
        <rect
          x={props.rimWidth}
          y={props.rimWidth}
          width={100 - props.rimWidth * 2}
          height={100 - props.rimWidth * 2}
        />
      </clipPath>
    </defs>
    {props.holes === "four" ? (
      <path
        xmlns="http://www.w3.org/2000/svg"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M100 50C100 77.6142 77.6142 100 50 100C22.3858 100 0 77.6142 0 50C0 22.3858 22.3858 0 50 0C77.6142 0 100 22.3858 100 50ZM45 38.3333C45 42.0152 42.0152 45 38.3333 45C34.6514 45 31.6667 42.0152 31.6667 38.3333C31.6667 34.6514 34.6514 31.6667 38.3333 31.6667C42.0152 31.6667 45 34.6514 45 38.3333ZM61.6667 45C65.3486 45 68.3333 42.0152 68.3333 38.3333C68.3333 34.6514 65.3486 31.6667 61.6667 31.6667C57.9848 31.6667 55 34.6514 55 38.3333C55 42.0152 57.9848 45 61.6667 45ZM45 61.6667C45 65.3486 42.0152 68.3333 38.3333 68.3333C34.6514 68.3333 31.6667 65.3486 31.6667 61.6667C31.6667 57.9848 34.6514 55 38.3333 55C42.0152 55 45 57.9848 45 61.6667ZM61.6667 68.3333C65.3486 68.3333 68.3333 65.3486 68.3333 61.6667C68.3333 57.9848 65.3486 55 61.6667 55C57.9848 55 55 57.9848 55 61.6667C55 65.3486 57.9848 68.3333 61.6667 68.3333Z"
        fill={props.baseColor}
        clipPath={props.shape === "round" ? undefined : "url(#square-clipper)"}
      />
    ) : (
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M50 100C77.6142 100 100 77.6142 100 50C100 22.3858 77.6142 0 50 0C22.3858 0 0 22.3858 0 50C0 77.6142 22.3858 100 50 100ZM34.2857 58.5714C39.0196 58.5714 42.8571 54.7339 42.8571 50C42.8571 45.2661 39.0196 41.4286 34.2857 41.4286C29.5518 41.4286 25.7143 45.2661 25.7143 50C25.7143 54.7339 29.5518 58.5714 34.2857 58.5714ZM64.2857 58.5714C69.0196 58.5714 72.8571 54.7339 72.8571 50C72.8571 45.2661 69.0196 41.4286 64.2857 41.4286C59.5518 41.4286 55.7143 45.2661 55.7143 50C55.7143 54.7339 59.5518 58.5714 64.2857 58.5714Z"
        fill={props.baseColor}
        clipPath={props.shape === "round" ? undefined : "url(#square-clipper)"}
      />
    )}
    {props.shape === "round" ? (
      <circle
        cx={50}
        cy={50}
        r={50 - props.rimWidth / 2}
        stroke={props.rimColor}
        fill="none"
        strokeWidth={props.rimWidth}
      />
    ) : (
      <rect
        x={props.rimWidth}
        y={props.rimWidth}
        width={100 - props.rimWidth * 2}
        height={100 - props.rimWidth * 2}
        stroke={props.rimColor}
        strokeWidth={props.rimWidth}
        fill="none"
      />
    )}
  </svg>
);
