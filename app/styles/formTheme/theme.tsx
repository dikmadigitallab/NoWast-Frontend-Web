export const formTheme = {
    "& .MuiSvgIcon-root": {
        color: "#000",
    },
    '& .MuiOutlinedInput-root': {
        borderRadius: "10px",
        "& input::placeholder": {
            opacity: 0.6,
        },
        "& input[type='date']:not(:focus)": {
            color: "rgba(0, 0, 0, 0.6)",
        },
    },
    "& .MuiInputLabel-root": {
        color: "#000",
        opacity: 0.7,
        "&.Mui-focused": {
            color: "#00B288",
            opacity: 1,
        },
    },
    "& .MuiOutlinedInput-root.Mui-focused fieldset": {
        borderColor: "#00B288",

    },
};