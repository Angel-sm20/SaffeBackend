export const normalizarOrigen = (valor) => {
    const origen = valor.trim();
    if (!origen) {
        return "";
    }

    try {
        return new URL(origen).origin;
    } catch {
        return origen.replace(/\/+$/, "");
    }
};
