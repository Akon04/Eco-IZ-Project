//
//  ContentView.swift
//  EcoIZ.01
//
//  Created by Ақерке Амиртай on 24.02.2026.
//

import SwiftUI

struct ContentView: View {
    @StateObject private var appState = AppState()

    var body: some View {
        Group {
            if appState.isAuthenticated {
                MainTabView()
            } else {
                AuthView()
            }
        }
        .tint(EcoTheme.primary)
        .environmentObject(appState)
    }
}

#Preview {
    ContentView()
}
