export const buttonTheme = {
    width: "fit-content",
    height: "45px",
    borderColor: "#00B288",
    gap: 1,
    backgroundColor: "#00B288",
    borderRadius: "10px",
    color: "white",
    "&:hover": {
        backgroundColor: "#8ED4B8"
    },
    boxShadow: "none",
    "&:disabled": {
        backgroundColor: "#ccc",
        color: "#666",
        cursor: "not-allowed"
    }
}

export const buttonThemeNoBackground = {
    width: "fit-content",
    height: "45px",
    borderColor: "#00B288",
    gap: 1,
    backgroundColor: "#fff",
    color: "#5E5873",
    borderRadius: "10px",
    "&:hover": {
        backgroundColor: "#8ED4B8",
        color: "#fff"
    },
    boxShadow: "none",
    "&:disabled": {
        backgroundColor: "#fff",
        color: "#666",
        cursor: "not-allowed"
    }
}
