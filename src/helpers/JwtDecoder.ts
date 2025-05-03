"use client";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id?: number;
  funcao?: string;
  nome?: string;
}

/**
 *
 * @returns {DecodedToken | null}
 */
export const pegarDadosDoToken = (): DecodedToken | null => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token não encontrado!");
    return null;
  }

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded;
  } catch (error) {
    console.error("Token inválido!", error);
    return null;
  }
};
