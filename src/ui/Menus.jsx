import { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { HiEllipsisVertical } from "react-icons/hi2";
import styled from "styled-components";
import { useOutsideClick } from "../hooks/useOutsideClick";

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

const StyledList = styled.ul`
  position: fixed;

  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);

  right: ${(props) => props.position.x}px;
  top: ${(props) => props.position.y}px;
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

const MenuContext = createContext();

function Menus({ children }) {
  const [openId, setOpenId] = useState("");
  const [buttonPosition, setButtonPosition] = useState(null);

  const close = () => setOpenId("");
  const open = setOpenId;

  return (
    <MenuContext.Provider
      value={{
        openId,
        close,
        open,
        setButtonPosition,
        buttonPosition,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

function Toggle({ id }) {
  const { open, close, openId, setButtonPosition } = useContext(MenuContext);

  function handleClick(e) {
    e.stopPropagation();

    // getting the position of the button to calculate the position
    const rect = e.target.closest("button").getBoundingClientRect();

    setButtonPosition({
      x: window.innerWidth - rect.width - rect.x,
      y: rect.y + rect.height + 8,
    });
    openId === "" || openId !== id ? open(id) : close();
  }

  return (
    <StyledToggle onClick={handleClick}>
      <HiEllipsisVertical />
    </StyledToggle>
  );
}

function List({ id, children }) {
  const { openId, buttonPosition, close } = useContext(MenuContext);
  // const { ref } = useOutsideClick(close);
  const { ref } = useOutsideClick(close, false);

  if (id !== openId) return null;

  // still we need like a modal and on top of the other elements
  return createPortal(
    <StyledList
      ref={ref}
      position={{ x: buttonPosition.x, y: buttonPosition.y }}
    >
      {children}
    </StyledList>,
    document.body
  );
}

function Button({ children, icon, onClick }) {
  const { close } = useContext(MenuContext);

  // it is inside the Menu.List so it is a li

  function handleClick() {
    onClick?.();
    close();
  }

  return (
    <li>
      <StyledButton onClick={handleClick}>
        {icon}
        <span>{children}</span>
      </StyledButton>
    </li>
  );
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
