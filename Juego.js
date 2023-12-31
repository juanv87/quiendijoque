import React, { useEffect, useState } from "react";
import { candidatos } from "./frases";
import { Roboto, Alfa_Slab_One } from "next/font/google";
import Confetti from "react-confetti";
import { Icon } from "@iconify/react";

import "animate.css";

const alfa = Alfa_Slab_One({
  weight: "400",
  subsets: ["latin"],
});
const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

const JuegoPreguntasRespuestas = () => {
  const [fraseAleatoria, setFraseAleatoria] = useState("");
  const [candidatoSeleccionado, setCandidatoSeleccionado] = useState("");
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [resultadoRespuesta, setResultadoRespuesta] = useState("");
  const [puntos, setPuntos] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [frasesSeleccionadas, setFrasesSeleccionadas] = useState([]);

  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  }, []);

  const [moves, setMoves] = useState(0);

  const maxMoves = 7;

  const obtenerFraseAleatoria = () => {
    const candidatoAleatorio =
      candidatos[Math.floor(Math.random() * candidatos.length)];
    let fraseAleatoria;

    // Buscar una frase que no haya sido seleccionada anteriormente
    do {
      fraseAleatoria =
        candidatoAleatorio.frases[
          Math.floor(Math.random() * candidatoAleatorio.frases.length)
        ];
    } while (frasesSeleccionadas.includes(fraseAleatoria));

    // Agregar la frase seleccionada al arreglo de frases seleccionadas
    setFrasesSeleccionadas([...frasesSeleccionadas, fraseAleatoria]);

    setFraseAleatoria(fraseAleatoria);
    setCandidatoSeleccionado("");
    setMostrarResultado(false);
  };

  const verificarRespuesta = (candidatoNombre) => {
    setMoves((v) => v + 1); // sumo 1 a moves
    if (moves >= maxMoves - 1) {
      // si moves es mayor o igual a maxMoves
      setTimeout(() => {
        setGameOver(true); // seteo gameOver en true
      }, 2000);
    }
    // Comprobar si el candidato seleccionado es el correcto
    const candidatoCorrecto = candidatos.find((candidato) =>
      candidato.frases.includes(fraseAleatoria)
    );
    const esCorrecto = candidatoCorrecto.nombre === candidatoNombre;
    setResultadoRespuesta(
      esCorrecto ? "Respuesta correcta" : "Respuesta incorrecta"
    );
    if (esCorrecto) {
      setPuntos(puntos + 1);
    }
    setMostrarResultado(true);

    // despues de 1s pasar a la siguiente frase
    setTimeout(() => {
      obtenerFraseAleatoria();
    }, 2000);
  };

  useEffect(() => {
    obtenerFraseAleatoria();
  }, []);

  const handleCandidateSelection = (candidatoNombre) => {
    setCandidatoSeleccionado(candidatoNombre);
    verificarRespuesta(candidatoNombre);
  };

  const handleReset = () => {
    setPuntos(0);
    setGameOver(false);
    setMoves(0);
    setFrasesSeleccionadas([]);
    obtenerFraseAleatoria();
  };

  const shareOnEmail = () => {
    const subject = "¡Gané en el juego electoral 2023!";
    const body = `¡Gané en ${moves} movimientos! Te desafío a completar el juego electoral 2023 aquí: https://prensaobrera.com`;

    const mailToUrl = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.open(mailToUrl);
  };

  const shareOnWhatsApp = () => {
    const message = `¡Sumé ${puntos} puntos! Te desafío a completar el juego electoral 2023 aquí: https://prensaobrera.com`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const shareOnFacebook = () => {
    const message = `¡Sumé ${puntos} puntos! Te desafío a completar el juego electoral 2023 aquí: https://prensaobrera.com`;
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  const shareOnTwitter = () => {
    const message = `¡Sumé ${puntos} puntos! Te desafío a completar el juego electoral 2023 aquí: https://prensaobrera.com`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  return (
    <>
      <div className="container">
        <h3 className={`${roboto.className}`}>¿Quién lo dijo?</h3>
        <h2 className={`pregunta ${alfa.className}`}>{fraseAleatoria}</h2>
        <div className="candidatos">
          {candidatos.map((candidato) => (
            <div
              onClick={() => handleCandidateSelection(candidato.nombre)}
              className="candidato"
              key={candidato.nombre}
            >
              <img src={candidato.img} alt={candidato.nombre} />
            </div>
          ))}
        </div>
      </div>
      {/*       <div className={`respuesta ${alfa.className}`}>
          <div className=" respuesta-correcta "> Respuesta correcta 👍 </div>
        </div> */}
      {mostrarResultado && resultadoRespuesta === "Respuesta correcta" && (
        <div className={`respuesta ${alfa.className}`}>
          <div className=" animate__animated animate__zoomInDown respuesta-correcta ">
            {" "}
            Respuesta correcta 👍{" "}
          </div>
        </div>
      )}
      {mostrarResultado && resultadoRespuesta === "Respuesta incorrecta" && (
        <div className={`respuesta ${alfa.className}`}>
          <div className=" animate__animated animate__zoomInDown respuesta-incorrecta ">
            {" "}
            Respuesta incorrecta 👎
          </div>
        </div>
      )}
      {gameOver && (
        <>
          <Confetti width={windowWidth} height={windowHeight} />
          <div className={`game-over ${alfa.className}`}>
            <div className="datos">
              <p>Terminaste!</p>
              <p>Sumaste {puntos} puntos</p>
              
              <div className="share-container">
                <p className={roboto.className}>Compartir:</p>
                <div className="share-icons">
                  <a href="#" onClick={() => shareOnEmail()}>
                    <Icon icon="ic:outline-email" width="35" />
                  </a>
                  <a href="#" onClick={() => shareOnWhatsApp()}>
                    <Icon icon="logos:whatsapp-icon" width="40" />
                  </a>
                  <a href="#" onClick={() => shareOnFacebook()}>
                    <Icon icon="logos:facebook" width="35" />
                  </a>
                  <a href="#" onClick={() => shareOnTwitter()}>
                    <Icon icon="skill-icons:twitter" width="35" />
                  </a>
                </div>
              </div>
              <button className={roboto.className} onClick={handleReset}>
                Volver a jugar
              </button>
            </div>
          </div>
        </>
      )}
      {!gameOver && (
        <div className={` puntos ${roboto.className}`}>Puntos: {puntos}</div>
      )}
    </>
  );
};

export default JuegoPreguntasRespuestas;
