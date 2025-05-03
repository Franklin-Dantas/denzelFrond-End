'use client';

import { useEffect, useState } from "react";
import Buttons from "./Buttons";
import Profile from "/public/Profile.svg";
import { pegarDadosDoToken } from "../helpers/JwtDecoder";

export default function ClientUserInfo() {
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const decoded = pegarDadosDoToken();
    if (decoded?.nome) {
      setUserName(decoded.nome);
    }
  }, []);

  if (!userName) return null;

  return (
    <Buttons icone={Profile} title={userName} path="../Pages/Usuario" dropdown="▼" />
  );
}
