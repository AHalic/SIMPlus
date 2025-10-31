import { LogoutOutlined } from "@mui/icons-material";
import { Divider, Drawer, List, Typography } from "@mui/material";
import Link from "next/link";
import ListButton from "./ListButton";


// TODO: ugly
export default function MenuDrawer({isOpenState}) {
    const [isMenuOpen, setIsMenuOpen] = isOpenState

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
            <List>
                <Typography 
                    sx={{
                        color: 'text.primary',
                        textAlign: "center",
                        fontWeight: "600",
                        fontSize: "18px",
                        marginY: "16px"
                    }}
                >
                    Menu
                </Typography>

                {/* List Functions*/}
                <Divider />
                
                <Link href="/users/new"  passHref style={{ textDecoration: 'none' }}>
                    {/* TODO: remove after manage page is ready */}
                    <ListButton
                        onClick={() => setIsMenuOpen(false)}
                        text="Add Employee"
                    />
                </Link>

                <Divider />

                <Link href="/profile"  passHref style={{ textDecoration: 'none' }}>
                    <ListButton
                        onClick={() => setIsMenuOpen(false)}
                        disabled
                        text="Profile"
                    />
                </Link>

                <Divider />

                <Link href="/users"  passHref style={{ textDecoration: 'none' }}>
                    {/* TODO: only for managers */}
                    <ListButton
                        disabled
                        onClick={() => setIsMenuOpen(false)}
                        text="Manage Employees"
                    />
                </Link>

                <Divider />

                <ListButton
                    icon={<LogoutOutlined />}
                    text="Sign out"
                    onClick={() => {
                        setIsMenuOpen(false)
                        // TODO: logout and navigate back to main page after logout
                    }}
                />

                <Divider />
            </List>
        </Drawer>
    )
}


