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

                <Divider />

                {/* List Functions*/}
                <Link href="/users"  passHref style={{ textDecoration: 'none' }}>
                    {/* TODO: only for managers */}
                    <ListButton
                        onClick={() => setIsMenuOpen(false)}
                        text="Manage Users"
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


