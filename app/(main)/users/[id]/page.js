"use client";

import { use, useState } from "react";

export default function UserDetailPage({ params }) {
    const { id } = use(params)
    const [user, setUser] = useState(null);

    return (
        <h1>{id}</h1>
    )
}
