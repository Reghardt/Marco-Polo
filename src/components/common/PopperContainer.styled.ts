import styled from "@emotion/styled";


const PopperContainer = styled.div`
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  border-radius: 50px;
  background-color: black;
  z-index: 2;
  /* margin-left: 10px;
  margin-right: 10px; */


  //text-align: center;

  .arrow {
    position: absolute;
    width: 10px;
    height: 20px;

    &:before {
      content: "";
      position: absolute;
      top: -0.3em; // we account for the PopperContainer padding
      left: 0;
      transform: rotate(45deg);
      width: 10px;
      height: 10px;
      background-color: white;
      box-shadow: none;
    }
  }

  &[data-popper-placement^='top'] > .arrow {
    bottom: -1.25em;
    :after {
        border-width: 0 1em 1em 1em;
        border-color: transparent transparent blue transparent;
    }
  }
`

export default PopperContainer;