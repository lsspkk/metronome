import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MenuIcon } from "../Icons";
import { NpButton } from "./NpButton";

export type MenuItem = {
  name: string;
  path: string;
  icon?: React.ReactNode;
  selected?: boolean;
};

const defaultMenuItems: MenuItem[] = [
  { name: "Songs", path: "/" },
  { name: "Metronome", path: "/metronome" },
  { name: "Import Text", path: "/import-text" },
  { name: "Import Url", path: "/import-url" },
  { name: "Export Url", path: "/export-url" },
];

export const NpNavigation = ({
  title,
  children,
  defaultOpen,
  menuItems = defaultMenuItems,
}: {
  title: string;
  children?: React.ReactNode;
  defaultOpen?: boolean;
  menuItems?: MenuItem[];
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const navigate = useNavigate();
  const pathname = window.location.pathname;

  const isSelected = (path: string) => {
    return (pathname === "" && (path === "/" || path === ""))
      || pathname === path || isMetronomeSongSelected(path);
  };

  const isMetronomeSongSelected = (path: string) => {
    return;
    path.startsWith("/metronome")
      && pathname.startsWith("/metronome/song");
  };

  return (
    <>
      <div className="top-0 fixed left-0 h-14 sm:h-18 z-10 flex gap-1 w-full bg-gray-100 pl-4 pr-1 py-1 border shadow mb-2">
        <h3 className="font-bold text-left flex-grow w-full">{title}</h3>
        <NpButton
          className="rounded-bl bg-transparent hover:bg-slate-300 opacity-50 py-0 mt-[1px] px-0 mb-[4px] text-gray-900"
          onClick={() => {
            setOpen(!open);
          }}
        >
          {open
            ? <MenuIcon className="w-10 h-11 -m-2 -mt-[6px] opacity-30 bg-opacity-30" />
            : <MenuIcon className="w-10 h-11 -m-2 -mt-[6px] text-gray-900" />}
        </NpButton>
      </div>

      {open && (
        <div className="z-10 fixed h-full w-full top-0" onClick={() => setOpen(false)}>
          <div className="z-20 fixed top-14 sm:top-18 max-h-[90vh] overflow-auto pb-20 bg-white shadow-xl flex flex-col gap-2 w-full items-center border-t-2  p-4">
            {menuItems?.map(({ name, path, icon }) => (
              <ul className="flex items-center gap-1 w-full max-w-sm" key={name}>
                <li
                  onClick={() =>
                    navigate(path)}
                  className={`cursor-pointer flex-grow flex gap-2 text-xl w-full items-center hover:bg-gray-200 p-2 ${
                    isSelected(path) ? "opacity-20" : ""
                  }`}
                  role="button"
                >
                  {icon}
                  {name}
                </li>
              </ul>
            ))}
          </div>
        </div>
      )}
      {children}
    </>
  );
};
