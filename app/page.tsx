"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trophy, Play, RotateCcw, Star, Zap, Volume2, VolumeX, Heart } from "lucide-react"

const QUESTIONS = [
  // Nivel 1 - Básico
  {
    question: "¿Qué tecla presionas para copiar algo en Windows 11?",
    options: ["Ctrl + C", "Ctrl + V", "Ctrl + X", "Ctrl + Z"],
    correct: 0,
    level: 1,
  },
  {
    question: "¿Qué tecla presionas para pegar algo que copiaste?",
    options: ["Ctrl + C", "Ctrl + V", "Ctrl + P", "Ctrl + S"],
    correct: 1,
    level: 1,
  },
  {
    question: "¿Qué programa usas para escribir documentos en Windows?",
    options: ["Paint", "Calculadora", "Word o Bloc de notas", "Explorador de archivos"],
    correct: 2,
    level: 1,
  },
  {
    question: "¿Cómo se llama el botón de inicio en Windows 11?",
    options: ["Botón de Windows", "Botón de Inicio", "Menú Principal", "Todas son correctas"],
    correct: 3,
    level: 1,
  },
  {
    question: "¿Qué es el ratón o mouse?",
    options: ["Un programa", "Un dispositivo para mover el cursor", "Una carpeta", "Un archivo"],
    correct: 1,
    level: 1,
  },
  {
    question: "¿Qué tecla usas para borrar texto hacia atrás?",
    options: ["Enter", "Espacio", "Backspace", "Delete"],
    correct: 2,
    level: 1,
  },

  // Nivel 2 - Intermedio
  {
    question: "¿Qué atajo de teclado usas para deshacer una acción?",
    options: ["Ctrl + Y", "Ctrl + Z", "Ctrl + X", "Ctrl + D"],
    correct: 1,
    level: 2,
  },
  {
    question: "¿Dónde guardas tus archivos en Windows 11?",
    options: ["En la papelera", "En carpetas", "En el navegador", "En el escritorio solamente"],
    correct: 1,
    level: 2,
  },
  {
    question: "¿Qué es un navegador web?",
    options: [
      "Un programa para navegar por internet",
      "Una carpeta de Windows",
      "Un tipo de archivo",
      "Un dispositivo de hardware",
    ],
    correct: 0,
    level: 2,
  },
  {
    question: "¿Cuál de estos es un navegador web?",
    options: ["Word", "Excel", "Google Chrome", "Paint"],
    correct: 2,
    level: 2,
  },
  {
    question: "¿Qué significa hacer clic derecho con el ratón?",
    options: ["Abrir un archivo", "Mostrar un menú de opciones", "Cerrar una ventana", "Copiar algo"],
    correct: 1,
    level: 2,
  },
  {
    question: "¿Qué es una carpeta en Windows 11?",
    options: ["Un programa", "Un lugar para organizar archivos", "Un tipo de documento", "Una aplicación"],
    correct: 1,
    level: 2,
  },
  {
    question: "¿Qué atajo usas para guardar un archivo?",
    options: ["Ctrl + G", "Ctrl + S", "Ctrl + A", "Ctrl + W"],
    correct: 1,
    level: 2,
  },

  // Nivel 3 - Avanzado
  {
    question: "¿Qué es el Explorador de archivos en Windows 11?",
    options: ["Un navegador web", "Un programa para ver y organizar archivos", "Un juego", "Un editor de texto"],
    correct: 1,
    level: 3,
  },
  {
    question: "¿Qué atajo de teclado cierra una ventana?",
    options: ["Ctrl + W o Alt + F4", "Ctrl + Q", "Ctrl + E", "Ctrl + C"],
    correct: 0,
    level: 3,
  },
  {
    question: "¿Qué es una extensión de archivo?",
    options: [
      "El tamaño del archivo",
      "Las letras después del punto que indican el tipo (.docx, .jpg)",
      "El nombre del archivo",
      "La fecha de creación",
    ],
    correct: 1,
    level: 3,
  },
  {
    question: "¿Qué es el escritorio en Windows 11?",
    options: [
      "Una aplicación",
      "La pantalla principal donde están los iconos",
      "Una carpeta especial",
      "El navegador web",
    ],
    correct: 1,
    level: 3,
  },
  {
    question: "¿Qué atajo usas para seleccionar todo el texto?",
    options: ["Ctrl + T", "Ctrl + A", "Ctrl + S", "Ctrl + E"],
    correct: 1,
    level: 3,
  },
  {
    question: "¿Qué es la barra de tareas en Windows 11?",
    options: [
      "Una carpeta",
      "La barra en la parte inferior con programas abiertos",
      "Un programa",
      "El menú de inicio",
    ],
    correct: 1,
    level: 3,
  },
  {
    question: "¿Qué tecla presionas para buscar en Windows 11?",
    options: ["Tecla Windows + S", "Ctrl + F", "Alt + B", "Ctrl + B"],
    correct: 0,
    level: 3,
  },
]

const MOTIVATIONAL_MESSAGES = [
  "¡Excelente!",
  "¡Genial!",
  "¡Increíble!",
  "¡Perfecto!",
  "¡Eres un crack!",
  "¡Sigue así!",
  "¡Impresionante!",
  "¡Fantástico!",
]

export default function ComputerRunnerGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const bgMusicRef = useRef<HTMLAudioElement | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [gameState, setGameState] = useState<"menu" | "playing" | "question" | "gameover">("menu")
  const [score, setScore] = useState(0)
  const [distance, setDistance] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState<(typeof QUESTIONS)[0] | null>(null)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [showMotivation, setShowMotivation] = useState<string | null>(null)
  const [particles, setParticles] = useState<Array<{ x: number; y: number; life: number; color: string }>>([])
  const [lives, setLives] = useState(3)
  const [showLevelUp, setShowLevelUp] = useState<number | null>(null)

  const gameRef = useRef({
    player: { x: 50, y: 0, velocityY: 0, isJumping: false },
    obstacles: [] as { x: number; y: number; width: number; height: number }[],
    clouds: [
      { x: 100, y: 50, speed: 0.5 },
      { x: 300, y: 80, speed: 0.3 },
      { x: 500, y: 40, speed: 0.4 },
    ],
    ground: 300,
    speed: 5,
    obstacleTimer: 0,
    questionTimer: 0,
    animationFrame: 0,
  })

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()

    const bgMusic = new Audio("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/game-8-bit-399898-C1Iq1uBu0gWBedX980poRUtCnrztBw.mp3")
    bgMusic.loop = true
    bgMusic.volume = 0.3
    bgMusicRef.current = bgMusic

    return () => {
      bgMusic.pause()
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const newMuted = !prev
      if (bgMusicRef.current) {
        bgMusicRef.current.muted = newMuted
      }
      return newMuted
    })
  }, [])

  const playBark = useCallback(() => {
    if (isMuted || !audioContextRef.current) return

    const audioContext = audioContextRef.current
    const duration = 0.15 // Duración del ladrido en segundos

    const oscillator1 = audioContext.createOscillator()
    const oscillator2 = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator1.type = "square"
    oscillator2.type = "sawtooth"

    oscillator1.frequency.setValueAtTime(800, audioContext.currentTime)
    oscillator1.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + duration)

    oscillator2.frequency.setValueAtTime(1200, audioContext.currentTime)
    oscillator2.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + duration)

    gainNode.gain.setValueAtTime(0, audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

    oscillator1.connect(gainNode)
    oscillator2.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator1.start(audioContext.currentTime)
    oscillator2.start(audioContext.currentTime)
    oscillator1.stop(audioContext.currentTime + duration)
    oscillator2.stop(audioContext.currentTime + duration)
  }, [isMuted])

  const startGame = useCallback(() => {
    setGameState("playing")
    setScore(0)
    setDistance(0)
    setQuestionsAnswered(0)
    setLevel(1)
    setShowMotivation(null)
    setParticles([])
    setLives(3)
    setShowLevelUp(null)
    gameRef.current = {
      player: { x: 50, y: 0, velocityY: 0, isJumping: false },
      obstacles: [],
      clouds: [
        { x: 100, y: 50, speed: 0.5 },
        { x: 300, y: 80, speed: 0.3 },
        { x: 500, y: 40, speed: 0.4 },
      ],
      ground: 300,
      speed: 5,
      obstacleTimer: 0,
      questionTimer: 0,
      animationFrame: 0,
    }
    if (bgMusicRef.current && !isMuted) {
      bgMusicRef.current.currentTime = 0
      bgMusicRef.current.play().catch(() => {
        // Ignore autoplay errors
      })
    }
  }, [isMuted])

  const showQuestion = useCallback(() => {
    const levelQuestions = QUESTIONS.filter((q) => q.level === level)
    if (levelQuestions.length === 0) return

    const randomQuestion = levelQuestions[Math.floor(Math.random() * levelQuestions.length)]
    setCurrentQuestion(randomQuestion)
    setGameState("question")
  }, [level])

  const createParticles = useCallback((x: number, y: number) => {
    const newParticles = []
    const colors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A"]
    for (let i = 0; i < 15; i++) {
      newParticles.push({
        x: x + Math.random() * 60 - 30,
        y: y + Math.random() * 60 - 30,
        life: 30,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }
    setParticles((prev) => [...prev, ...newParticles])
  }, [])

  const handleAnswer = useCallback(
    (selectedIndex: number) => {
      if (!currentQuestion) return

      if (selectedIndex === currentQuestion.correct) {
        const points = level * 100
        setScore((prev) => prev + points)
        setQuestionsAnswered((prev) => prev + 1)

        const message = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)]
        setShowMotivation(message)
        setTimeout(() => setShowMotivation(null), 2000)

        createParticles(400, 200)

        if ((questionsAnswered + 1) % 3 === 0 && level < 3) {
          const newLevel = level + 1
          setLevel(newLevel)
          setShowLevelUp(newLevel)
          setTimeout(() => setShowLevelUp(null), 3000)
          gameRef.current.speed += 2
        }
      } else {
        setLives((prev) => {
          const newLives = prev - 1
          if (newLives <= 0) {
            setGameState("gameover")
            if (score > highScore) {
              setHighScore(score)
            }
          }
          return newLives
        })
      }

      setCurrentQuestion(null)
      setGameState("playing")
      gameRef.current.questionTimer = 0
    },
    [currentQuestion, score, highScore, level, questionsAnswered, createParticles],
  )

  const drawCloud = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = "#FFFFFF"
    ctx.globalAlpha = 0.7
    ctx.beginPath()
    ctx.arc(x, y, 15, 0, Math.PI * 2)
    ctx.arc(x + 15, y - 5, 20, 0, Math.PI * 2)
    ctx.arc(x + 30, y, 15, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
  }

  const drawChihuahua = (ctx: CanvasRenderingContext2D, x: number, y: number, frame: number) => {
    const legOffset = Math.floor(frame / 5) % 2 === 0 ? 2 : 0

    ctx.fillStyle = "#D2691E"
    ctx.fillRect(x + 10, y + 15, 30, 20)

    ctx.fillStyle = "#D2691E"
    ctx.fillRect(x + 35, y + 10, 20, 20)

    ctx.fillStyle = "#8B4513"
    ctx.fillRect(x + 35, y + 5, 8, 10)
    ctx.fillRect(x + 47, y + 5, 8, 10)

    ctx.fillStyle = "#000000"
    ctx.fillRect(x + 40, y + 15, 3, 3)
    ctx.fillRect(x + 48, y + 15, 3, 3)

    ctx.fillStyle = "#000000"
    ctx.fillRect(x + 52, y + 22, 3, 3)

    ctx.fillStyle = "#D2691E"
    ctx.fillRect(x + 15, y + 35 + legOffset, 5, 10)
    ctx.fillRect(x + 30, y + 35 - legOffset, 5, 10)

    ctx.fillStyle = "#D2691E"
    ctx.fillRect(x + 5, y + 18, 8, 5)
    ctx.fillRect(x, y + 13, 8, 5)
  }

  const drawCactus = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = "#2F4F2F"
    ctx.fillRect(x + 15, y, 10, 50)

    ctx.fillRect(x + 5, y + 15, 10, 5)
    ctx.fillRect(x + 5, y + 10, 5, 15)

    ctx.fillRect(x + 25, y + 20, 10, 5)
    ctx.fillRect(x + 30, y + 15, 5, 15)

    ctx.fillStyle = "#1C3A1C"
    ctx.fillRect(x + 17, y + 10, 2, 2)
    ctx.fillRect(x + 21, y + 20, 2, 2)
    ctx.fillRect(x + 17, y + 35, 2, 2)
  }

  useEffect(() => {
    if (gameState !== "playing") return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number

    const gameLoop = () => {
      const game = gameRef.current

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "#87CEEB")
      gradient.addColorStop(1, "#E0F6FF")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      game.clouds.forEach((cloud) => {
        drawCloud(ctx, cloud.x, cloud.y)
        cloud.x -= cloud.speed
        if (cloud.x < -50) {
          cloud.x = canvas.width + 50
        }
      })

      ctx.fillStyle = "#C2B280"
      ctx.fillRect(0, game.ground, canvas.width, canvas.height - game.ground)

      ctx.fillStyle = "#8B7355"
      ctx.fillRect(0, game.ground, canvas.width, 2)

      ctx.fillStyle = "#A0826D"
      for (let i = 0; i < 10; i++) {
        const x = (game.animationFrame * 2 + i * 80) % canvas.width
        ctx.fillRect(x, game.ground + 10, 5, 3)
      }

      if (game.player.isJumping) {
        game.player.velocityY += 0.8
        game.player.y += game.player.velocityY

        if (game.player.y >= 0) {
          game.player.y = 0
          game.player.velocityY = 0
          game.player.isJumping = false
        }
      }

      const playerY = game.ground - 45 + game.player.y

      drawChihuahua(ctx, game.player.x, playerY, game.animationFrame)

      const obstacleFrequency = 100 - (level - 1) * 15
      game.obstacleTimer++
      if (game.obstacleTimer > obstacleFrequency) {
        game.obstacles.push({
          x: canvas.width,
          y: game.ground - 50,
          width: 40,
          height: 50,
        })
        game.obstacleTimer = 0
      }

      game.obstacles = game.obstacles.filter((obstacle) => {
        obstacle.x -= game.speed

        drawCactus(ctx, obstacle.x, obstacle.y)

        if (
          game.player.x + 10 < obstacle.x + obstacle.width - 10 &&
          game.player.x + 50 > obstacle.x + 10 &&
          playerY + 10 < obstacle.y + obstacle.height - 10 &&
          playerY + 40 > obstacle.y + 10
        ) {
          setLives((prev) => {
            const newLives = prev - 1
            if (newLives <= 0) {
              setGameState("gameover")
              if (score > highScore) {
                setHighScore(score)
              }
            }
            return newLives
          })
          return false
        }

        return obstacle.x > -obstacle.width
      })

      setDistance((prev) => prev + 1)
      if (game.animationFrame % 100 === 0) {
        game.speed += 0.1
      }

      const questionFrequency = 400 - (level - 1) * 50
      game.questionTimer++
      if (game.questionTimer > questionFrequency) {
        showQuestion()
        return
      }

      game.animationFrame++
      animationId = requestAnimationFrame(gameLoop)
    }

    gameLoop()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [gameState, score, highScore, showQuestion, level])

  useEffect(() => {
    if (particles.length === 0) return

    const interval = setInterval(() => {
      setParticles((prev) => prev.map((p) => ({ ...p, life: p.life - 1 })).filter((p) => p.life > 0))
    }, 50)

    return () => clearInterval(interval)
  }, [particles])

  useEffect(() => {
    if ((gameState === "menu" || gameState === "gameover") && bgMusicRef.current) {
      bgMusicRef.current.pause()
    }
  }, [gameState])

  useEffect(() => {
    if (gameState !== "playing") return

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" && !gameRef.current.player.isJumping) {
        e.preventDefault()
        gameRef.current.player.isJumping = true
        gameRef.current.player.velocityY = -15
        playBark()
      }
    }

    window.addEventListener("keydown", handleKeyPress)

    return () => {
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [gameState, playBark])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 font-mono">
            Chihuahua Runner
          </h1>
          <p className="text-muted-foreground text-lg">Aprende computación mientras te diviertes saltando obstáculos</p>
        </div>

        <Card className="relative overflow-hidden shadow-2xl border-4 border-primary/30">
          <canvas ref={canvasRef} width={800} height={400} className="w-full bg-background" />

          {particles.map((particle, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full pointer-events-none"
              style={{
                left: particle.x,
                top: particle.y,
                backgroundColor: particle.color,
                opacity: particle.life / 30,
                transform: `scale(${particle.life / 30})`,
                transition: "all 0.05s",
              }}
            />
          ))}

          {showMotivation && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="text-6xl font-bold text-yellow-400 animate-bounce drop-shadow-lg">{showMotivation}</div>
            </div>
          )}

          {showLevelUp && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50">
              <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-12 py-8 rounded-2xl border-4 border-white shadow-2xl animate-pulse">
                <div className="text-center space-y-2">
                  <Star className="h-16 w-16 mx-auto text-white animate-spin" />
                  <p className="text-6xl font-bold font-mono drop-shadow-lg">¡NIVEL {showLevelUp}!</p>
                  <p className="text-2xl font-semibold">{showLevelUp === 2 ? "Intermedio" : "Avanzado"}</p>
                </div>
              </div>
            </div>
          )}

          {gameState === "menu" && (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/95 via-purple-500/95 to-pink-500/95 flex flex-col items-center justify-center gap-6">
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold text-white font-mono">Bienvenido al Curso de Computación</h2>
                <p className="text-lg text-white/90 max-w-md">
                  Presiona <kbd className="px-2 py-1 bg-white/20 rounded text-white font-mono">ESPACIO</kbd> para saltar
                </p>
                <p className="text-md text-white/80">Responde correctamente para avanzar de nivel</p>
                <div className="flex gap-4 justify-center mt-4">
                  <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg">
                    <Star className="inline mr-1 h-5 w-5 text-yellow-300" />
                    <span className="text-white font-bold">Nivel 1: Básico</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg">
                    <Star className="inline mr-1 h-5 w-5 text-yellow-300" />
                    <span className="text-white font-bold">Nivel 2: Intermedio</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg">
                    <Star className="inline mr-1 h-5 w-5 text-yellow-300" />
                    <span className="text-white font-bold">Nivel 3: Avanzado</span>
                  </div>
                </div>
              </div>
              <Button
                size="lg"
                onClick={startGame}
                className="text-xl px-8 py-6 bg-white text-purple-600 hover:bg-white/90 shadow-xl"
              >
                <Play className="mr-2 h-6 w-6" />
                Comenzar Aventura
              </Button>
              {highScore > 0 && (
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-6 py-3 rounded-lg">
                  <Trophy className="h-6 w-6 text-yellow-300" />
                  <span className="font-mono text-xl text-white font-bold">Récord: {highScore}</span>
                </div>
              )}
            </div>
          )}

          {gameState === "question" && currentQuestion && (
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/98 via-purple-500/98 to-pink-500/98 flex items-center justify-center p-8">
              <Card className="max-w-2xl w-full p-8 border-4 border-yellow-400 shadow-2xl bg-white">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Zap className="h-8 w-8 text-yellow-500" />
                  <h3 className="text-3xl font-bold text-center text-purple-600">Nivel {level}</h3>
                  <Zap className="h-8 w-8 text-yellow-500" />
                </div>
                <h3 className="text-2xl font-bold text-center mb-6 text-foreground">{currentQuestion.question}</h3>
                <div className="grid grid-cols-1 gap-3">
                  {currentQuestion.options.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      variant="outline"
                      className="text-lg py-6 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all border-2 hover:scale-105 hover:shadow-lg"
                    >
                      {String.fromCharCode(65 + index)}. {option}
                    </Button>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {gameState === "gameover" && (
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/95 via-orange-500/95 to-yellow-500/95 flex flex-col items-center justify-center gap-6">
              <div className="text-center space-y-4">
                <h2 className="text-5xl font-bold text-white font-mono drop-shadow-lg">Game Over</h2>
                <div className="space-y-2 bg-white/20 backdrop-blur p-6 rounded-xl">
                  <p className="text-3xl text-white font-mono font-bold">Puntuación: {score}</p>
                  <p className="text-xl text-white/90 font-mono">Distancia: {Math.floor(distance / 10)}m</p>
                  <p className="text-xl text-white/90 font-mono">Preguntas correctas: {questionsAnswered}</p>
                  <p className="text-xl text-white/90 font-mono">Nivel alcanzado: {level}</p>
                  {score > highScore && (
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <Trophy className="h-8 w-8 text-yellow-300 animate-bounce" />
                      <p className="text-3xl text-yellow-300 font-bold animate-pulse">Nuevo Récord</p>
                      <Trophy className="h-8 w-8 text-yellow-300 animate-bounce" />
                    </div>
                  )}
                </div>
              </div>
              <Button
                size="lg"
                onClick={startGame}
                className="text-xl px-8 py-6 bg-white text-orange-600 hover:bg-white/90 shadow-xl"
              >
                <RotateCcw className="mr-2 h-6 w-6" />
                Jugar de Nuevo
              </Button>
            </div>
          )}

          {gameState === "playing" && (
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white backdrop-blur px-4 py-2 rounded-lg border-2 border-white/30 shadow-lg">
                <p className="text-sm font-bold">Puntuación</p>
                <p className="text-2xl font-bold font-mono">{score}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white backdrop-blur px-4 py-2 rounded-lg border-2 border-white/30 shadow-lg">
                <p className="text-sm font-bold">Distancia</p>
                <p className="text-2xl font-bold font-mono">{Math.floor(distance / 10)}m</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white backdrop-blur px-4 py-2 rounded-lg border-2 border-white/30 shadow-lg">
                <p className="text-sm font-bold">Correctas</p>
                <p className="text-2xl font-bold font-mono">{questionsAnswered}</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white backdrop-blur px-4 py-2 rounded-lg border-2 border-white/30 shadow-lg flex items-center gap-2">
                <Star className="h-5 w-5" />
                <div>
                  <p className="text-sm font-bold">Nivel</p>
                  <p className="text-2xl font-bold font-mono">{level}</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-red-500 to-pink-500 text-white backdrop-blur px-4 py-2 rounded-lg border-2 border-white/30 shadow-lg">
                <p className="text-sm font-bold mb-1">Vidas</p>
                <div className="flex gap-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Heart
                      key={i}
                      className={`h-6 w-6 ${i < lives ? "fill-white text-white" : "fill-white/20 text-white/20"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={toggleMute}
            className="absolute bottom-4 right-4 bg-white/90 hover:bg-white shadow-lg"
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
        </Card>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Cada pregunta correcta suma {level * 100} puntos. Avanza de nivel cada 3 respuestas correctas
          </p>
          <p className="text-xs text-muted-foreground">
            Tienes 3 vidas. Pierdes una vida por cada respuesta incorrecta o colisión
          </p>
        </div>
      </div>
    </div>
  )
}
