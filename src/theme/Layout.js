import React from "react";
import Layout from "@theme-original/Layout";
import BubbleCursor from "@site/src/components/BubbleCursor"; // Import the effect

export default function LayoutWrapper(props) {
  return (
    <>
      <Layout {...props} />
      <BubbleCursor />
    </>
  );
}