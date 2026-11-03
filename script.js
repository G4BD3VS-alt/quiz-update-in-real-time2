
import { createClient } from
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://ulaqohbfagajzrmxqlzd.supabase.co";
const SUPABASE_KEY = "sb_publishable_Q6qKuuMOXHqzzW12Vb8QlA_ujgzEDJq";

const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const questions = [
    {
        question: "Qual é a principal diferença entre viés (bias) e variância em um modelo de Machine Learning?",
        options: [
            "Viés mede erros por simplificação excessiva; variância mede sensibilidade às flutuações dos dados de treino.",
            "Viés mede o tamanho do conjunto de dados; variância mede o número de classes do problema.",
            "Viés se aplica apenas a redes neurais; variância se aplica apenas a árvores de decisão.",
            "Viés é o tempo de treino; variância é o tempo de inferência."
        ],
        correct: 0
    },
    {
        question: "Por que K-fold Cross-Validation pode ser preferível a uma única divisão treino/teste?",
        options: [
            "Porque elimina completamente o overfitting.",
            "Porque permite avaliar o modelo em diferentes divisões dos dados, reduzindo a dependência de uma única amostra.",
            "Porque transforma automaticamente o problema em aprendizado não supervisionado.",
            "Porque aumenta o número de linhas de cada conjunto sem modificar os dados originais."
        ],
        correct: 1
    },
    {
        question: "Em qual situação a métrica F1-score costuma ser mais adequada que a acurácia?",
        options: [
            "Quando o conjunto é perfeitamente balanceado.",
            "Quando a precisão e o recall possuem pesos idênticos no problema.",
            "Quando há classes muito desbalanceadas e os falsos positivos e falsos negativos são relevantes.",
            "Quando todas as classes têm exatamente o mesmo número de amostras."
        ],
        correct: 2
    },
    {
        question: "Qual técnica é usada para reduzir a dimensionalidade preservando ao máximo a variância dos dados?",
        options: [
            "Regressão Logística",
            "Análise de Componentes Principais (PCA)",
            "Regularização L1",
            "One-hot encoding"
        ],
        correct: 1
    },
    {
        question: "Qual é a principal finalidade da regularização L2 (ridge) em um modelo linear?",
        options: [
            "Selecionar exatamente um atributo de cada grupo de características correlacionadas, zerando seus coeficientes.",
            "Aumentar o número de variáveis independentes do modelo.",
            "Penalizar coeficientes grandes para reduzir variância e melhorar a generalização.",
            "Garantir que o modelo alcance acurácia de 100% nos dados de treino."
        ],
        correct: 2
    },
    {
        question: "O que diferencia um conjunto de validação do conjunto de teste?",
        options: [
            "O conjunto de validação é usado para ajustar hiperparâmetros; o de teste avalia o modelo final sem servir à seleção frequente.",
            "O conjunto de validação contém apenas rótulos; o de teste contém apenas características.",
            "O conjunto de teste é usado durante o treinamento; o de validação nunca é usado.",
            "Não existe diferença: ambos podem ser usados indiscriminadamente durante o ajuste do modelo."
        ],
        correct: 0
    },
    {
        question: "Por que vazamento de dados (data leakage) pode invalidar uma avaliação de modelo?",
        options: [
            "Porque faz o modelo funcionar apenas quando está conectado à internet.",
            "Porque remove automaticamente todas as classes minoritárias dos dados.",
            "Porque permite que informações do conjunto de teste influenciem o treinamento ou pré-processamento, produzindo avaliação otimista.",
            "Porque substitui o conjunto de treino por dados sintéticos sem rótulos."
        ],
        correct: 2
    }
];

let currentQuestionIndex = 0;
let score = 0;
let currentUserName = "";

window.addEventListener('DOMContentLoaded', () => {
    renderLeaderboard();
});

function switchScreen(screenId) {
    document.querySelectorAll(
        '#screen-home, #screen-quiz, #screen-result'
    ).forEach(el => {
        el.classList.add('is-hidden');
    });

    document.body.classList.toggle('result-view', screenId === 'screen-result');
    document.getElementById(screenId).classList.remove('is-hidden');
}

async function renderLeaderboard() {
    const listContainer =
        document.getElementById("home-leaderboard-list");

    const resultPodiumContainer =
        document.getElementById("result-podium");

    const resultRestContainer =
        document.getElementById("result-rest-list");

    const adminListContainer =
        document.getElementById("admin-leaderboard-list");

    const playersCountEl =
        document.getElementById("total-players-count");

    try {
        const { data, error } = await supabase
            .from("quiz_scores")
            .select("id, name, score, total, created_at")
            .order("score", { ascending: false })
            .order("created_at", { ascending: true })
            .limit(100);

        if (error) throw error;

        const leaderboard = data ?? [];

        if (playersCountEl) {
            playersCountEl.textContent =
                `${leaderboard.length} ${
                    leaderboard.length === 1
                        ? "registro"
                        : "registros"
                }`;
        }

        if (leaderboard.length === 0) {
            const emptyHTML = `
                <div class="empty-state">Nenhum registro no placar ainda.</div>
            `;

            if (listContainer) {
                listContainer.innerHTML = emptyHTML;
            }

            if (adminListContainer) {
                adminListContainer.innerHTML = emptyHTML;
            }

            if (resultPodiumContainer) {
                resultPodiumContainer.innerHTML = emptyHTML;
            }

            if (resultRestContainer) {
                resultRestContainer.innerHTML = "";
            }

            return;
        }

        if (listContainer) {
            listContainer.innerHTML = leaderboard
                .map((item, index) => {
                    const medal = ["🥇", "🥈", "🥉"][index];

                    return `
                        <div class="score-row">
                            <div class="score-player">
                                <span class="score-medal">${medal || `#${index + 1}`}</span>
                                <span class="score-name">${escapeHTML(item.name)}</span>
                            </div>
                            <span class="score-value">${item.score} / ${item.total} pts</span>
                        </div>
                    `;
                })
                .join("");
        }

        if (resultPodiumContainer) {
            resultPodiumContainer.innerHTML = leaderboard
                .slice(0, 3)
                .map((item, index) => `
                    <article class="podium-card podium-card--${["gold", "silver", "bronze"][index]}">
                        <span class="podium-place">${index + 1}º lugar</span>
                        <svg class="podium-trophy" viewBox="0 0 32 32" aria-hidden="true">
                            <path d="M10 4h12v7a6 6 0 0 1-12 0V4Z"/>
                            <path d="M10 7H5v3a5 5 0 0 0 5 5m12-8h5v3a5 5 0 0 1-5 5M16 17v6m-5 4h10m-8-4h6v4h-6z"/>
                        </svg>
                        <span class="podium-player">${escapeHTML(item.name)}</span>
                        <span class="podium-score">${item.score} / ${item.total} pts</span>
                    </article>
                `)
                .join("");
        }

        if (resultRestContainer) {
            const remainingPlayers = leaderboard.slice(3);
            resultRestContainer.innerHTML = remainingPlayers.length
                ? remainingPlayers
                    .map((item, index) => `
                        <div class="score-row">
                            <div class="score-player">
                                <span class="score-medal">#${index + 4}</span>
                                <span class="score-name">${escapeHTML(item.name)}</span>
                            </div>
                            <span class="score-value">${item.score} / ${item.total} pts</span>
                        </div>
                    `)
                    .join("")
                : `<div class="empty-state">Ainda não há outras colocações.</div>`;
        }

        if (adminListContainer) {
            adminListContainer.innerHTML = leaderboard
                .map(item => `
                    <div class="admin-score-row">
                        <span class="admin-player-score">
                            ${escapeHTML(item.name)}
                            (${item.score}/${item.total})
                        </span>
                        <div class="admin-row-actions">
                            <span>#${escapeHTML(String(item.id))}</span>
                            <button type="button"
                                data-delete-id="${escapeHTML(String(item.id))}"
                                class="delete-record"
                                title="Excluir registro"
                                aria-label="Excluir pontuação de ${escapeHTML(item.name)}">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18m-2 0-.9 14H5.9L5 6m4 0V4h6v2m-5 4v6m4-6v6"/></svg>
                            </button>
                        </div>
                    </div>
                `)
                .join("");

            adminListContainer
                .querySelectorAll("[data-delete-id]")
                .forEach(button => {
                    button.addEventListener("click", () => {
                        adminDeleteSingleRecord(button.dataset.deleteId);
                    });
                });
        }
    } catch (error) {
        console.error("Erro ao carregar o ranking:", error);

        if (listContainer) {
            listContainer.textContent =
                "Não foi possível carregar o ranking. Tente novamente.";
        }

        if (resultPodiumContainer) {
            resultPodiumContainer.textContent =
                "Não foi possível carregar o ranking. Tente novamente.";
        }

        if (resultRestContainer) {
            resultRestContainer.textContent = "";
        }
    }
}

function startQuiz() {
    const nameInput = document.getElementById('username').value.trim();

    if (!nameInput) {
        alert("Por favor, digite seu nome ou apelido para começar o quiz!");
        return;
    }

    if (questions.length === 0) {
        alert("Nenhuma pergunta cadastrada no quiz!");
        return;
    }

    currentUserName = nameInput;
    currentQuestionIndex = 0;
    score = 0;

    document.getElementById('player-display').textContent = currentUserName;

    switchScreen('screen-quiz');
    loadQuestion();
}

function loadQuestion() {
    const q = questions[currentQuestionIndex];
    const total = questions.length;

    document.getElementById('question-progress').textContent =
        `Questão ${currentQuestionIndex + 1} de ${total}`;

    document.getElementById('question-text').textContent = q.question;

    const progressPercent = (currentQuestionIndex / total) * 100;

    document.getElementById('progress-bar').style.width =
        `${progressPercent}%`;

    const container = document.getElementById('options-container');
    container.innerHTML = "";

    q.options.forEach((option, index) => {
        const btn = document.createElement('button');

        btn.className = "answer-option";

        btn.innerHTML = `
            <span class="answer-letter">
                ${String.fromCharCode(65 + index)}
            </span>

            <span class="answer-copy">${escapeHTML(option)}</span>
        `;

        btn.onclick = () => selectOption(index);

        container.appendChild(btn);
    });
}

function selectOption(selectedIndex) {
    const q = questions[currentQuestionIndex];

    if (selectedIndex === q.correct) {
        score++;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        finishQuiz();
    }
}

async function finishQuiz() {
    document.getElementById("progress-bar").style.width = "100%";

    const total = questions.length;

    document.getElementById("final-score").textContent =
        `${score} / ${total}`;

    const percentage = (score / total) * 100;
    const feedbackEl =
        document.getElementById("feedback-message");

    if (percentage === 100) {
        feedbackEl.textContent =
            "Excelente! Você domina Machine Learning! 🎉";
    } else if (percentage >= 70) {
        feedbackEl.textContent =
            "Muito bom! Você tem ótimos conhecimentos na área. 🚀";
    } else if (percentage >= 40) {
        feedbackEl.textContent =
            "Bom esforço! Continue estudando os conceitos. 📚";
    } else {
        feedbackEl.textContent =
            "Não desanime! Revise os conceitos e tente novamente. 💪";
    }

    switchScreen("screen-result");

    feedbackEl.textContent += " Salvando pontuação...";

    try {
        await saveScore(currentUserName, score, total);

        feedbackEl.textContent =
            "Pontuação registrada no ranking global!";

        await renderLeaderboard();
    } catch (error) {
        feedbackEl.textContent =
            "Quiz concluído, mas não foi possível salvar sua pontuação. Tente novamente mais tarde.";
    }
}

async function saveScore(name, finalScore, totalQuestions) {
    const { error } = await supabase
        .from("quiz_scores")
        .insert({
            name: name.trim().slice(0, 60),
            score: finalScore,
            total: totalQuestions
        });

    if (error) {
        console.error("Erro ao salvar a pontuação:", error);
        throw error;
    }
}

function resetHome() {
    document.getElementById('username').value = "";

    renderLeaderboard();
    switchScreen('screen-home');
}

function openAdminModal() {
    document.getElementById('admin-password').value = "";

    document.getElementById('admin-auth-view').classList.remove('is-hidden');
    document.getElementById('admin-panel-view').classList.add('is-hidden');
    document.getElementById('admin-modal').classList.remove('is-hidden');
}

function closeAdminModal() {
    document.getElementById('admin-modal').classList.add('is-hidden');
}

function verifyAdminPassword() {
    const pass = document.getElementById('admin-password').value;

    if (pass === "1234") {
        document.getElementById('admin-auth-view').classList.add('is-hidden');
        document.getElementById('admin-panel-view').classList.remove('is-hidden');

        renderLeaderboard();
    } else {
        alert("Senha incorreta! A senha padrão é 1234.");

        document.getElementById('admin-password').value = "";
    }
}

async function adminDeleteSingleRecord(id) {
    if (!confirm("Tem certeza que deseja excluir esta pontuação?")) return;

    const { data, error } = await supabase
        .from("quiz_scores")
        .delete()
        .eq("id", id)
        .select("id");

    if (error) {
        console.error("Erro ao excluir pontuação:", error);
        alert("Não foi possível excluir. Verifique a política DELETE no Supabase.");
        return;
    }

    if (!data?.length) {
        alert("Nenhum registro foi excluído. Verifique as permissões da tabela.");
        return;
    }

    await renderLeaderboard();
}

async function adminClearLeaderboard() {
    if (
        confirm(
            "Tem certeza absoluta que deseja apagar todo o histórico do placar? Esta ação não pode ser desfeita."
        )
    ) {
        const { data, error } = await supabase
            .from("quiz_scores")
            .delete()
            .not("id", "is", null)
            .select("id");

        if (error) {
            console.error("Erro ao limpar o placar:", error);
            alert("Não foi possível limpar o placar. Verifique a política DELETE no Supabase.");
            return;
        }

        await renderLeaderboard();
        alert(`${data?.length ?? 0} registro(s) apagado(s).`);
    }
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag =>
        ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

Object.assign(window, {
    startQuiz,
    openAdminModal,
    closeAdminModal,
    verifyAdminPassword,
    resetHome,
    adminClearLeaderboard
});
