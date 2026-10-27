import { useCallback, useEffect, useState } from "react";
import api from "../api/axios.js";

// সব শাখার তালিকা + নামভিত্তিক স্থায়ী color index
const ORDER = ["Dhaka", "Chattogram", "Sylhet", "Khulna", "Rajshahi"];

export default function useBranches() {
  const [branches, setBranches] = useState([]);
  useEffect(() => {
    api.get("/branches").then(({ data }) => setBranches(data)).catch(() => {});
  }, []);

  const colorOf = useCallback((name) => {
    const i = ORDER.indexOf(name);
    if (i !== -1) return i;
    return (ORDER.length + [...name].reduce((s, ch) => s + ch.charCodeAt(0), 0)) % 6;
  }, []);

  return { branches, colorOf };
}
