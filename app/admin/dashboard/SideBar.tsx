'use client';

import useUserStore from '@/app/stores/user';
import { sideBarAdminList, sideBarList } from '@/app/utils/data';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import {
  FaBars,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaChevronUp,
  FaX,
} from 'react-icons/fa6';

const SideBar = ({
  isIconOnly,
  toggleIconOnly,
}: {
  isIconOnly: boolean;
  toggleIconOnly: any;
}) => {
  const pathName = usePathname();
  const [mobile, setMobile] = useState(false);
  const role = useUserStore((state) => state.user?.role);
  const [showDropDown, setShowDropDown] = useState(false);
  const navigate = useRouter();

  return (
    <>
      <button
        className="grid md:hidden fixed bottom-5 right-8 rounded-full text-white bg-primary h-[3rem] w-[3rem] place-items-center z-40"
        onClick={() => setMobile(!mobile)}
      >
        {mobile ? <FaX /> : <FaBars />}
      </button>

      <aside
        className={`pt-5 md:grid grid-rows-[max-content_1fr_max-content] items-start h-full border-r ${
          mobile
            ? 'grid fixed top-0 left-0 w-full h-full z-30 bg-white'
            : 'hidden'
        }`}
      >
        <ul className="flex w-full flex-col items-stretch text-center">
          {(role !== 'Admin' ? sideBarList : sideBarAdminList).map((item) => (
            <div key={item.id} className="flex flex-col">
              <li
                onClick={() => {
                  !item.list && setMobile(false);
                  item.path && !item.isDropdown && navigate.push(item.path);
                  item.list &&
                    item.isDropdown &&
                    setShowDropDown(!showDropDown);
                }}
                className={`flex gap-2 items-center py-4 px-4 cursor-pointer transition-all ${
                  pathName === item.path
                    ? 'bg-primary text-white'
                    : `border-transparent ${
                        item.color
                          ? `${item.color} hover:${item.color}`
                          : 'text-gray-500 hover:text-black'
                      }`
                }
                ${isIconOnly ? 'justify-center' : 'justify-between'}
                `}
              >
                <div className="flex items-center gap-1">
                  <span>{item.icon}</span>
                  {!isIconOnly && <span className="text-sm">{item.title}</span>}
                </div>

                {item.list && !isIconOnly && showDropDown && (
                  <FaChevronUp className="text-xs" />
                )}

                {item.list && !isIconOnly && !showDropDown && (
                  <FaChevronDown className="text-xs" />
                )}
              </li>

              {item.list && showDropDown && (
                <ul className="flex flex-col text-left">
                  {item.list &&
                    item.list.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => {
                          setMobile(false);
                          item.path && navigate.push(item.path);
                        }}
                        className={`flex items-center py-4 px-4 cursor-pointer transition-all
                        ${
                          pathName === item.path
                            ? 'bg-primary text-white'
                            : `bg-transaprent text-gray-500 hover:text-black`
                        }
                        ${isIconOnly ? 'justify-center' : 'justify-between'}
                        `}
                      >
                        <div className="flex items-center gap-1">
                          <span>{item.icon}</span>
                          {!isIconOnly && (
                            <span className="text-sm">{item.title}</span>
                          )}
                        </div>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          ))}
        </ul>
        <div></div>
        <button
          onClick={() => toggleIconOnly(!isIconOnly)}
          className="grid place-items-center h-[3rem]"
        >
          {isIconOnly ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </aside>
    </>
  );
};

export default SideBar;
