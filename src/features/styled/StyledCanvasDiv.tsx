import styled from "styled-components";

interface IStyledCanvasDivProps {
  height: number;
  width: number;
}

const StyledCanvasDiv = styled.div<IStyledCanvasDivProps>`
  box-styling: border-box;
  padding: 0;
  display: inline-block;
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  border: solid black 2px;
  overflow: hidden;
`;

export default StyledCanvasDiv;
