import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/Memory.css";

import { API_URL } from "../App";

// API Link
const API_URL = `http://localhost:3000/api`;

const Memory = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [singleMemory, setSingleMemory] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

}
export default Memory;