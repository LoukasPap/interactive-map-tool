// import { useState, useEffect } from "react";

const Info = ({ picked }) => {
  return (
    <>
      <button class="bg-neutral-50 rounded-sm px-4 py-2 hover:bg-neutral-100 absolute right-0 m-5 z-10">
        WHY
      </button>
      <h1 class="text-3xl absolute font-serif capitalize">
        Hello world! {picked}
      </h1>
    </>
  );
};

export default Info;
