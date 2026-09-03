export async function GET(request: Request) {
    return Response.json({
        success: true,
        message: "API Gestor de Gastos funcionando",
    });
}
