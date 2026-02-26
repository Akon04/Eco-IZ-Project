import Foundation
import Combine

@MainActor
final class AppState: ObservableObject {
    @Published var isAuthenticated = false
    @Published var user = UserProfile(
        fullName: "Eco User",
        email: "user@ecoiz.app",
        points: 90,
        streakDays: 2,
        co2SavedTotal: 8.6
    )
    @Published var activities: [EcoActivity] = []
    @Published var challenges: [Challenge] = [
        Challenge(
            title: "7 eco-действий за неделю",
            description: "Добавь 7 любых экологичных активностей",
            targetCount: 7,
            currentCount: 0,
            rewardPoints: 60,
            badgeSymbol: "leaf.fill",
            badgeTintHex: 0x43B244,
            badgeBackgroundHex: 0xEAF8DF
        ),
        Challenge(
            title: "3 дня без пластика",
            description: "Отмечай действия категории Пластик",
            targetCount: 3,
            currentCount: 0,
            rewardPoints: 40,
            badgeSymbol: "waterbottle.fill",
            badgeTintHex: 0x1AA5E6,
            badgeBackgroundHex: 0xE7F5FF
        ),
        Challenge(
            title: "Эко-транспорт",
            description: "5 поездок пешком/велосипедом/метро",
            targetCount: 5,
            currentCount: 0,
            rewardPoints: 45,
            badgeSymbol: "figure.walk.circle.fill",
            badgeTintHex: 0xF09A00,
            badgeBackgroundHex: 0xFFF5E2
        )
    ]
    @Published var posts: [EcoPost] = []
    @Published var chatMessages: [ChatMessage] = [
        ChatMessage(
            isUser: false,
            text: "Привет! Я Eco AI. Помогу улучшить твои эко-привычки и мотивацию.",
            createdAt: Date()
        )
    ]

    private var lastActivityDate: Date?

    let templatesByCategory: [ActivityCategory: [ActivityTemplate]] = [
        .transport: [
            ActivityTemplate(title: "Пешая прогулка", estimatedCO2: 1.2, points: 16),
            ActivityTemplate(title: "Метро", estimatedCO2: 0.8, points: 12),
            ActivityTemplate(title: "Велосипед", estimatedCO2: 1.5, points: 18),
            ActivityTemplate(title: "Самокат", estimatedCO2: 0.9, points: 11),
            ActivityTemplate(title: "Автобус вместо машины", estimatedCO2: 1.0, points: 13)
        ],
        .plastic: [
            ActivityTemplate(title: "Без пакета", estimatedCO2: 0.3, points: 8),
            ActivityTemplate(title: "Многоразовая сумка", estimatedCO2: 0.5, points: 10),
            ActivityTemplate(title: "Многоразовая бутылка", estimatedCO2: 0.6, points: 10),
            ActivityTemplate(title: "Сдал пластик", estimatedCO2: 0.9, points: 14)
        ],
        .water: [
            ActivityTemplate(title: "Короткий душ", estimatedCO2: 0.4, points: 9),
            ActivityTemplate(title: "Закрыл кран вовремя", estimatedCO2: 0.2, points: 6),
            ActivityTemplate(title: "Устранил утечку", estimatedCO2: 0.8, points: 14),
            ActivityTemplate(title: "Установил аэратор", estimatedCO2: 0.7, points: 12),
            ActivityTemplate(title: "Полная загрузка стирки", estimatedCO2: 0.6, points: 11)
        ],
        .waste: [
            ActivityTemplate(title: "Сортировка отходов", estimatedCO2: 0.9, points: 13),
            ActivityTemplate(title: "Сдал вторсырье", estimatedCO2: 1.1, points: 15),
            ActivityTemplate(title: "Компост", estimatedCO2: 0.7, points: 12)
        ],
        .energy: [
            ActivityTemplate(title: "Отключил ненужные приборы", estimatedCO2: 0.5, points: 10),
            ActivityTemplate(title: "Использовал дневной свет", estimatedCO2: 0.4, points: 9),
            ActivityTemplate(title: "Альтернатива электрическому свету", estimatedCO2: 0.6, points: 11)
        ]
    ]

    init() {
        seedInitialData()
    }

    func signIn(email: String, password: String) {
        guard !email.isEmpty, !password.isEmpty else { return }
        user.email = email
        isAuthenticated = true
    }

    func register(name: String, email: String, password: String) {
        guard !name.isEmpty, !email.isEmpty, !password.isEmpty else { return }
        user = UserProfile(fullName: name, email: email, points: 0, streakDays: 0, co2SavedTotal: 0)
        isAuthenticated = true
    }

    func signOut() {
        isAuthenticated = false
    }

    func addActivity(
        category: ActivityCategory,
        title: String,
        co2: Double,
        points: Int,
        note: String? = nil,
        media: [PostMediaAttachment] = [],
        shareToNews: Bool = true
    ) {
        let newItem = EcoActivity(
            category: category,
            title: title,
            co2Saved: co2,
            points: points,
            createdAt: Date()
        )
        activities.insert(newItem, at: 0)

        user.co2SavedTotal += co2
        user.points += points
        updateStreak(with: newItem.createdAt)
        updateChallenges(for: newItem)

        guard shareToNews else { return }

        let trimmedNote = (note ?? "").trimmingCharacters(in: .whitespacesAndNewlines)
        let text = trimmedNote.isEmpty
            ? "Добавил активити: \(title) (\(category.rawValue))"
            : "Добавил активити: \(title) (\(category.rawValue))\n\(trimmedNote)"

        let post = EcoPost(
            author: user.fullName,
            text: text,
            createdAt: Date(),
            media: media
        )
        posts.insert(post, at: 0)
    }

    func addPost(text: String, media: [PostMediaAttachment] = []) {
        let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty || !media.isEmpty else { return }
        posts.insert(
            EcoPost(author: user.fullName, text: trimmed, createdAt: Date(), media: media),
            at: 0
        )
    }

    func sendMessageToAI(_ text: String) {
        let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }

        chatMessages.append(ChatMessage(isUser: true, text: trimmed, createdAt: Date()))
        chatMessages.append(
            ChatMessage(
                isUser: false,
                text: aiResponse(for: trimmed),
                createdAt: Date()
            )
        )
    }

    private func aiResponse(for input: String) -> String {
        let lowercase = input.lowercased()
        if lowercase.contains("вода") {
            return "Попробуй 5-минутный душ и проверь, нет ли протечек. Это дает стабильный эффект каждый день."
        }
        if lowercase.contains("транспорт") || lowercase.contains("машин") {
            return "2-3 поездки в неделю на метро, автобусе или велосипеде уже заметно снижают личный CO2 след."
        }
        if lowercase.contains("мотивац") || lowercase.contains("сложно") {
            return "Сфокусируйся на streak: одно небольшое действие в день лучше, чем идеальный, но редкий рывок."
        }
        return "Отличный вопрос. Держи ритм: выбери 1 активити из воды, 1 из энергии и 1 из пластика сегодня."
    }

    private func updateStreak(with date: Date) {
        let calendar = Calendar.current
        defer { lastActivityDate = date }

        guard let last = lastActivityDate else {
            user.streakDays = max(user.streakDays, 1)
            return
        }

        if calendar.isDate(date, inSameDayAs: last) { return }
        if let yesterday = calendar.date(byAdding: .day, value: -1, to: date),
           calendar.isDate(last, inSameDayAs: yesterday) {
            user.streakDays += 1
        } else {
            user.streakDays = 1
        }
    }

    private func updateChallenges(for activity: EcoActivity) {
        for index in challenges.indices {
            if challenges[index].isCompleted { continue }
            switch challenges[index].title {
            case "7 eco-действий за неделю":
                challenges[index].currentCount += 1
            case "3 дня без пластика":
                if activity.category == .plastic {
                    challenges[index].currentCount += 1
                }
            case "Эко-транспорт":
                if activity.category == .transport {
                    challenges[index].currentCount += 1
                }
            default:
                break
            }

            if challenges[index].isCompleted {
                user.points += challenges[index].rewardPoints
            }
        }
    }

    private func seedInitialData() {
        let first = EcoActivity(
            category: .energy,
            title: "Отключил ненужные приборы",
            co2Saved: 0.5,
            points: 10,
            createdAt: Date().addingTimeInterval(-3600 * 20)
        )
        let second = EcoActivity(
            category: .plastic,
            title: "Многоразовая сумка",
            co2Saved: 0.5,
            points: 10,
            createdAt: Date().addingTimeInterval(-3600 * 44)
        )
        activities = [first, second]
        posts = [
            EcoPost(author: "Nurs", text: "Сегодня выбрал метро вместо машины", createdAt: Date().addingTimeInterval(-3500), media: []),
            EcoPost(author: "Aya", text: "Сортирую отходы уже 5 дней подряд", createdAt: Date().addingTimeInterval(-9800), media: [])
        ]
        challenges[0].currentCount = 2
        challenges[1].currentCount = 1
        challenges[2].currentCount = 0
        lastActivityDate = first.createdAt
    }
}
