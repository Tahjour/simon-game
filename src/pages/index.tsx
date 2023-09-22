import { useCallback, useEffect, useState } from "react";

const buttonColors = ["red", "blue", "green", "yellow"];

export default function Home() {
  const [gamePattern, setGamePattern] = useState<string[]>([]);
  const [userClickedPattern, setUserClickedPattern] = useState<string[]>([]);
  const [level, setLevel] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [buttonFlash, setButtonFlash] = useState<string | null>(null);
  const [gameOverFlash, setGameOverFlash] = useState<boolean>(false);

  const nextSequence = useCallback(() => {
    setUserClickedPattern([]);
    const randomNumber = Math.floor(Math.random() * 4);
    const randomChosenColor = buttonColors[randomNumber];
    setButtonFlash(randomChosenColor);
    setTimeout(() => setButtonFlash(null), 400);
    setGamePattern((prevGamePattern) => {
      return [...prevGamePattern, randomChosenColor];
    });
    setLevel((prevLevel) => {
      return prevLevel + 1;
    });
  }, []);

  useEffect(() => {
    function handleKeyDown() {
      if (!gameStarted) {
        setGameOver(false);
        setGameStarted(true);
        nextSequence();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameStarted, gameOver, nextSequence]); // Only re-run the effect if the gameStarted state changes

  function checkAnswers(newUserClickedPattern: string[], currentIndex: number) {
    if (newUserClickedPattern[currentIndex] === gamePattern[currentIndex]) {
      if (newUserClickedPattern.length === gamePattern.length) {
        setTimeout(() => {
          nextSequence();
        }, 1000);
      }
    } else {
      playSound("wrong");
      setGameStarted(false);
      setGameOver(true);
      setGameOverFlash(true);
      setTimeout(() => setGameOverFlash(false), 200);
      setLevel(0);
      setGamePattern([]);
    }
  }

  function playSound(name: string) {
    var randomChosenColorBtnAudio = new Audio(`/sounds/${name}.mp3`);
    randomChosenColorBtnAudio.play();
  }

  function handleButtonClick(event: React.MouseEvent<HTMLButtonElement>, buttonColor: string) {
    const newUserClickedPattern = [...userClickedPattern, buttonColor];
    setUserClickedPattern(newUserClickedPattern);
    playSound(buttonColor);
    const target = event.target as HTMLButtonElement;
    target.style.backgroundColor = "grey";
    target.style.boxShadow = "0 0 1vmax white";
    setTimeout(() => {
      target.style.backgroundColor = buttonColor;
      target.style.boxShadow = "";
    }, 100);
    checkAnswers(newUserClickedPattern, newUserClickedPattern.length - 1);
  }

  return (
    <section className={`simonGameBox ${gameOverFlash ? "gameOverFlashScreen" : ""}`}>
      <h1 id="levelTitle">
        {gameStarted && `Level: ${level}`}
        {!gameStarted && !gameOver && "Press any key to start"}
        {gameOver && !gameStarted ? "Game Over. Press a key to restart." : ""}
      </h1>
      <p className="howToPlayTip">
        The Simon Game, a short term memory test. Try to remember the pattern of flashes.
      </p>
      <div className="buttonsBox">
        {buttonColors.map((buttonColor) => (
          <button
            key={buttonColor}
            className={`btn ${buttonColor} ${buttonFlash === buttonColor ? "buttonFlash" : ""}`}
            // style={{ backgroundColor: buttonColor }}
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              gameStarted && handleButtonClick(event, buttonColor);
            }}
          ></button>
        ))}
      </div>
    </section>
  );
}
