function LogoPurple(props) {
  return (
    <svg
      width={48}
      height={48}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <mask
        id="a"
        style={{
          maskType: "alpha",
        }}
        maskUnits="userSpaceOnUse"
        x={0}
        y={0}
        width={48}
        height={48}
      >
        <path fill="#D9D9D9" d="M0 0h48v48H0z" />
      </mask>
      <g mask="url(#a)">
        <path
          d="M31.945 12.293c2.332-1.585 5.527-.324 6.15 2.425l4.56 20.15c.71 3.135-2.38 5.784-5.37 4.605l-21.65-8.541c-2.99-1.18-3.438-5.224-.78-7.03l17.09-11.61Z"
          fill="#9174DC"
        />
        <path
          d="M15.194 12.293c-2.331-1.585-5.526-.324-6.149 2.425l-4.56 20.15c-.71 3.135 2.38 5.784 5.369 4.605l21.65-8.541c2.99-1.18 3.439-5.224.78-7.03l-17.09-11.61Z"
          fill="#6036D0"
        />
        <path
          d="M20.339 7.593c1.585-2.354 5.05-2.354 6.635 0l11.688 17.352c1.79 2.657-.114 6.235-3.318 6.235H11.97c-3.204 0-5.108-3.578-3.318-6.235L20.339 7.593Z"
          fill="#734DD5"
        />
      </g>
    </svg>
  );
}

export { LogoPurple };
