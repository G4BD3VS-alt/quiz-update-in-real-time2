
import { createClient } from
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://adxlhosaaxzjknejeoms.supabase.co";
const SUPABASE_KEY = "sb_publishable_AdC79Ncb_iDj3WSw5dxXew_TahImL2b";

const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const questions = [
    {
        question: "Como um modelo de Machine Learning costuma aprender a fazer previsões?",
        options: [
            "Analisa exemplos e identifica padrões que ajudam a prever resultados em novos casos.",
            "Segue uma lista fixa de respostas escrita manualmente para cada situação possível.",
            "Escolhe respostas aleatórias e melhora sem usar exemplos ou informações.",
            "Armazena todos os dados e sempre repete exatamente a última resposta recebida."
        ],
        correct: 0
    },
    {
        question: "Em um exemplo de aprendizado supervisionado, o que é o rótulo (label)?",
        options: [
            "A ordem em que os exemplos foram adicionados ao computador.",
            "O resultado conhecido associado a um exemplo, que serve de referência para o modelo aprender.",
            "O nome do programa usado para armazenar os dados.",
            "Uma previsão que o modelo faz antes de receber qualquer exemplo."
        ],
        correct: 1
    },
    {
        question: "Um aplicativo prevê se uma mensagem é spam ou não e outro estima o preço de uma casa. Como esses problemas se diferenciam?",
        options: [
            "O primeiro é aprendizado supervisionado; o segundo não pode usar dados anteriores.",
            "Os dois são previsões de categorias, porque usam informações de casas e mensagens.",
            "O primeiro prevê uma categoria; o segundo estima um valor numérico.",
            "O primeiro estima um valor numérico; o segundo escolhe apenas entre categorias."
        ],
        correct: 2
    },
    {
        question: "Por que é importante avaliar um modelo usando exemplos que ele não usou para aprender?",
        options: [
            "Para garantir que ele sempre acerte todos os exemplos usados no treino.",
            "Para verificar se ele consegue lidar com casos novos, e não apenas com os exemplos de treino.",
            "Para permitir que as respostas dos exemplos de teste sejam incluídas no treino.",
            "Para reduzir a quantidade de exemplos que o modelo precisa analisar."
        ],
        correct: 1
    },
    {
        question: "Um modelo acerta muito nos exemplos usados no treino, mas erra bastante em casos novos. O que pode estar acontecendo?",
        options: [
            "Ele recebeu exemplos demais e, por isso, deixou de conseguir fazer previsões.",
            "Os casos novos precisam ser removidos para que o resultado do treino continue alto.",
            "Ele pode ter se ajustado demais aos exemplos de treino, sem aprender padrões que funcionem bem em outros casos.",
            "Ele está necessariamente funcionando como esperado, pois acertou durante o treino."
        ],
        correct: 2
    },
    {
        question: "Se os dados usados para treinar um modelo representam mal parte das pessoas, qual pode ser uma consequência?",
        options: [
            "O modelo pode apresentar resultados menos confiáveis para essas pessoas ou repetir distorções presentes nos dados.",
            "O modelo corrige automaticamente os dados e passa a representar todas as pessoas igualmente.",
            "A falta de exemplos variados afeta apenas o espaço de armazenamento, não as previsões.",
            "O modelo deixa de conseguir fazer qualquer tipo de previsão."
        ],
        correct: 0
    },
    {
        question: "Por que usar, sem querer, informações do teste durante o treinamento pode levar a uma avaliação enganosa?",
        options: [
            "Porque o teste fica maior que o treino e, por isso, todas as respostas se tornam aleatórias.",
            "Porque os dados de teste não podem conter exemplos com respostas conhecidas.",
            "Porque o treinamento passa a usar menos etapas e sempre demora mais.",
            "Porque o modelo pode usar informações que não teria ao encontrar casos novos, fazendo o resultado parecer melhor do que realmente é."
        ],
        correct: 3
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
