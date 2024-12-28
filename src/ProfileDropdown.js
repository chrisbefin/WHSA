import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import useLogout from 'hooks/useLogout';
import { UserCircleIcon } from '@heroicons/react/24/outline'


export default function ProfileDropdown() {
    const logout = useLogout();

    return (
        <Menu as="div" className="relative ml-3">
        <div>
            <MenuButton className="rrelative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
            <span className="absolute -inset-1.5" />
            <span className="sr-only">Open user menu</span>
            <UserCircleIcon aria-hidden="true" className="size-8 text-gray"></UserCircleIcon>
            
            </MenuButton>
        </div>
        <MenuItems
            transition
            className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
        >
            <MenuItem>
            <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
            >
                Your Profile
            </a>
            </MenuItem>
            <MenuItem>
            <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
            >
                Settings
            </a>
            </MenuItem>
            <MenuItem>
            <a
                href="#"
                onClick={logout}
                className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
            >
                Log out
            </a>
            </MenuItem>
        </MenuItems>
        </Menu>
    )
}