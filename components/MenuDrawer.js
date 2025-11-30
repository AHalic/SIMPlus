import { AddToPhotosOutlined, InsertChartOutlined, LogoutOutlined, PeopleAltOutlined, PersonOutline } from "@mui/icons-material";
import { Drawer, List, Typography } from "@mui/material";
import Link from "next/link";
import ListButton from "./ListButton";
import BoxIcon from "./BoxIcon";
import { getCookies, signOut } from "@/app/actions";
import { useEffect, useState, useTransition } from "react";

export default function MenuDrawer({isOpenState}) {
    const [isMenuOpen, setIsMenuOpen] = isOpenState

    const [cookies, setCookies] = useState();
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        startTransition(async () => {
            const cookie = await getCookies()
            setCookies(cookie)
        })
    }, [])

    
    const closeDrawer = (event) => {
        if ( event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')) {
                return;
        }
            
        setIsMenuOpen(false)
    };

    return (
        <Drawer
            anchor="right"
            open={isMenuOpen}
            onClose={closeDrawer}
        >
            <List
                sx={{
                    padding: 0,
                    minWidth: "250px",
                }}
            >
                <Typography 
                    sx={{
                        color: 'text.primary',
                        textAlign: "center",
                        fontWeight: "600",
                        fontSize: "18px",
                        paddingY: "20px",
                        backgroundColor: 'background.default',
                    }}
                >
                    SIM+
                </Typography>

                <Link href="/"  passHref style={{ textDecoration: 'none' }}>
                    <ListButton
                        icon={<BoxIcon size={20} />}
                        onClick={() => setIsMenuOpen(false)}
                        text="Inventory"
                        link="/"
                    />
                </Link>

                <Link href="/report"  passHref style={{ textDecoration: 'none' }}>
                    <ListButton
                        icon={<InsertChartOutlined />}
                        onClick={() => setIsMenuOpen(false)}
                        text="Reports"
                        link="/report"
                    />
                </Link>                


                <Link href="/profile"  passHref style={{ textDecoration: 'none' }}>
                    <ListButton
                        onClick={() => setIsMenuOpen(false)}
                        disabled
                        text="Profile"
                        link="/profile"
                        icon={<PersonOutline />}
                    />
                </Link>

                {cookies?.role === 'Manager' && (
                    <>
                        <Link href="/users" passHref style={{ textDecoration: 'none' }}>
                            <ListButton
                                onClick={() => setIsMenuOpen(false)}
                                text="Manage Employees"
                                link="/users"
                                icon={<PeopleAltOutlined />}
                            />
                        </Link>

                        <Link href="items/new" passHref style={{ textDecoration: 'none' }}>
                            <ListButton
                                onClick={() => setIsMenuOpen(false)}
                                text="Mass Item Addition"
                                link="/items/new"
                                icon={<AddToPhotosOutlined />}
                            />
                        </Link>
                    </>
                )}

                <form id="signout-form" action={signOut}>
                    <ListButton
                        icon={<LogoutOutlined />}
                        text="Sign out"
                        onClick={() => {
                            setIsMenuOpen(false)

                            const form = document.getElementById('signout-form')
                            if (form) {
                                if (typeof form.requestSubmit === 'function') form.requestSubmit()
                                else form.submit()
                            }
                        }}
                    />
                </form>
            </List>
        </Drawer>
    )
}


