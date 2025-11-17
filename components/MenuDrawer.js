import { InsertChartOutlined, LogoutOutlined, PeopleAltOutlined, PersonOutline } from "@mui/icons-material";
import { Drawer, List, Typography } from "@mui/material";
import Link from "next/link";
import ListButton from "./ListButton";
import BoxIcon from "./BoxIcon";

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

                <Link href="/users/new"  passHref style={{ textDecoration: 'none' }}>
                    {/* TODO: remove after manage page is ready */}
                    <ListButton
                        onClick={() => setIsMenuOpen(false)}
                        text="Add Employee"
                        link="/users/new"
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

                <Link href="/users"  passHref style={{ textDecoration: 'none' }}>
                    {/* TODO: only for managers */}
                    <ListButton
                        disabled
                        onClick={() => setIsMenuOpen(false)}
                        text="Manage Employees"
                        link="/users"
                        icon={<PeopleAltOutlined />}
                    />
                </Link>

                <ListButton
                    icon={<LogoutOutlined />}
                    text="Sign out"
                    onClick={() => {
                        setIsMenuOpen(false)
                        // TODO: logout and navigate back to main page after logout
                    }}
                />
            </List>
        </Drawer>
    )
}


