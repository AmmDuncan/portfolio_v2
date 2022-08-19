import Image from "next/image";
import styled from "styled-components";
import { motion } from "framer-motion";

const MyImageRoot = styled.div`
  position: relative;
  box-sizing: border-box;
  width: 100%;
  max-width: 24rem;
  margin-top: 4rem;
  margin-inline: auto;
  border-radius: 50%;
  background: var(--color-image-bg);

  @media (min-width: 768px) {
    max-width: 28rem;
  }

  .shape {
    width: 100%;
    padding-top: 100%;
  }

  .image-container {
    position: absolute;
    width: 70%;
    padding-top: 70%;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
  }
`;

function MyImage() {
  return (
    <MyImageRoot
      as={motion.div}
      initial={{ opacity: 0, y: 24 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, type: "spring", mass: 2, damping: 13 }}
    >
      <motion.div
        className="shape"
        initial={{ opacity: 0, y: 24 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, type: "spring", mass: 2, damping: 8, delay: 0.15 }}
      >
        <div className="image-container">
          <Image src="/assets/images/memoji.png" alt="me" layout="fill" />
        </div>
      </motion.div>
    </MyImageRoot>
  );
}

export default MyImage;
