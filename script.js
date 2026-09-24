<section class="game-section">
    <h2>Pong</h2>

    <p>Velg hvilken spiller du vil kontrollere:</p>

    <div class="game-controls">
        <button id="chooseLeft">Spill som venstre</button>
        <button id="chooseRight">Spill som høyre</button>
        <button id="restartGame">Start på nytt</button>
    </div>

    <p id="instructions">
        Velg en spiller for å starte.
    </p>

    <div id="score">0–0</div>

    <canvas id="gameCanvas" width="900" height="500">
        Nettleseren din støtter ikke canvas.
    </canvas>
</section>

<script src="script.js"></script>
