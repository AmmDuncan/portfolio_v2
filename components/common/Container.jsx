import styled from "styled-components";

const ContainerRoot = styled.div`
  width: calc(100% - 4.8rem);
  max-width: 128rem;
  margin-inline: auto;
`;

function Container(props) {
  return <ContainerRoot {...props}>{props.children}</ContainerRoot>;
}

export { Container };
