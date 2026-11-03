# Valores conocidos para pruebas

Salen de ejecutar la lógica de los prototipos. Úsalos como pruebas de regresión.

## Módulo 1
Parámetros iniciales: A r=0,8; B r=0,6 ω=0,5 φ=1,2; C r=0,3 ω=0 φ=2,0; D r=0,7 ω=0,4 φ=1,57. Camino inicial 101, nodo seleccionado C.
Convención: arista 0 = r·e^(iω); arista 1 = √(1−r²)·e^(iφ). Amplitud = producto de las aristas del camino (A, luego B o C según q1, luego D).
- Con camino 101: módulo 0,129 y probabilidad 0,017.
- Probabilidades iniciales de |000⟩ a |111⟩: 0,113 0,118 0,201 0,209 0,016 0,017 0,161 0,167. Suma 1.
- Con r del nodo C en 0,9: 0,113 0,118 0,201 0,209 0,143 0,149 0,034 0,035 (solo cambian los estados que empiezan en 1).
- Cambiar ω o φ no cambia ninguna probabilidad.

## Módulo 2
Estado en 4 qubits, nodos por nivel (q1..q4) del diagrama exacto, y mejor fidelidad con el Accordion (bloques de dos qubits, mayor valor singular al cuadrado de la matriz [(q1 q2),(q3 q4)]).

| Estado | Nodos por nivel | Total | Fidelidad |
|---|---|---|---|
| Producto (|+⟩^4) | 1,1,1,1 | 4 | 1,0000 |
| Bell ⊗ Bell (pares 1-2 y 3-4) | 1,2,1,2 | 6 | 1,0000 |
| Bell en 2-3, qubits 1 y 4 en |+⟩ | 1,1,2,1 | 5 | 0,5000 |
| GHZ | 1,2,2,2 | 7 | 0,5000 |
| W | 1,2,2,2 | 7 | 0,5000 |
| Mezcla producto↔GHZ en 0,5 | 1,2,3,3 | 9 | 0,7938 |
| Estado genérico del prototipo | 1,2,4,8 | 15 | 0,5181 |

La mezcla es normalizar(cos t · |+⟩^4 + sin t · GHZ) con t = valor · π/2. Con valor 0: 1,1,1,1 y fidelidad 1. Con valor 0,01: 1,2,3,3 y fidelidad 0,9998. Con valor 1: 1,2,2,2 y fidelidad 0,5.

## Módulo 3
Energía exacta del estado base (cadena abierta; H = Σ ZZ + g·Σ X para Ising; Σ (XX+YY+ZZ) para Heisenberg):

| Hamiltoniano | n | Energía exacta |
|---|---|---|
| Z₁Z₂ | 4 | −1,0000 |
| Ising g=0 | 4 | −3,0000 |
| Ising g=1 | 4 | −4,7588 |
| Heisenberg | 4 | −6,4641 |
| Heisenberg | 6 | −9,9743 |

Comprobaciones de operadores: la energía de |0000⟩ con Z₁Z₂ es +1; el singlete (|01⟩−|10⟩)/√2 da XX+YY+ZZ = −3; el estado construido desde los parámetros está normalizado.

Ansatz: bloques de dos qubits; cada bloque tiene 3 nodos (primero, segundo-si-0, segundo-si-1) y cada nodo tres parámetros (θ, ω, φ) con r = cos θ. Parámetros: 9 por bloque (18 con n=4, 27 con n=6).

Entrenamiento con Adam (β1=0,9, β2=0,999), tasa 0,05, semilla 1, gradiente por diferencias finitas (ε=1e-4). El error final depende del generador aleatorio, pero la tendencia debe repetirse:
- Z₁Z₂ n=4 tras 600 épocas: error < 1e-8.
- Ising g=0 n=4 tras 600 épocas: error < 1e-8.
- Ising g=1 n=4: se estanca cerca de 0,23.
- Ising g=10 n=4: se estanca cerca de 0,025.
- Heisenberg n=4: se estanca cerca de 0,464 (límite del ansatz, no un fallo).
