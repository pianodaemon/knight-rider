export const TAB_CATEGORIES = {
    catalogos: {
        icon: "ListAltIcon",
        name: "Catálogos",
        menuItems: [
            {
                audits: {
                    icon: "AccountBalanceIcon",
                    name: "Auditorías",
                    path: "/audit/list"
                },
            }
        ],
        path: "/catalogos",
    },
    captura: {
        icon: "DeveloperBoardIcon",
        name: "Captura",
        menuItems: [],
        path: "/captura",
    },
    reportes: {
        icon: "LibraryBooksIcon",
        name: "Reportes",
        menuItems: [],
        path: "/reportes",
    },
    admin: {
        icon: "SettingsIcon",
        name: "Catálogos",
        menuItems: [
            {
                users: {
                    icon: "PersonIcon",
                    name: "Usuarios",
                    path: "/user/list"
                },
            }
        ],
        path: "/admin",
    },
};