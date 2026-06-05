import React from "react";

type Props = React.SVGProps<SVGSVGElement>;

const LeafOld: React.FC<Props> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 140" {...props}>
    <path
      d="M88 112 C96 122 103 132 108 142"
      fill="none"
      stroke="#976302"
      strokeWidth={7}
      strokeLinecap="round"
    />

    <path
      d="M20 10 C12 35 12 65 25 85 C38 106 58 118 83 123 C98 126 103 120 98 106 C95 98 99 86 98 74 C96 54 81 38 60 28 C42 20 29 15 20 10 Z"
      fill="#976302"
    />

    <path
      d="M24 18 C18 38 18 61 30 80 C42 98 60 108 81 112 C92 114 95 109 91 98 C88 90 91 80 90 70 C88 55 76 43 58 35 C43 28 31 23 24 18"
      fill="none"
      stroke="#976302"
      strokeWidth={0.8}
      opacity={0.6}
    />

    <ellipse
      cx={31}
      cy={46}
      rx={2}
      ry={3}
      fill="none"
      stroke="#976302"
      strokeWidth={0.7}
    />
    <ellipse
      cx={82}
      cy={86}
      rx={3}
      ry={4}
      fill="none"
      stroke="#976302"
      strokeWidth={0.7}
    />
  </svg>
);

export default LeafOld;
