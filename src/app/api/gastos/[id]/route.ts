import { supabase } from "@/src/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
    params: Promise<{ id: string }>;
};

// ===============================
// OBTENER GASTO POR ID
// ===============================

export async function GET(req: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        const { data, error } = await supabase
            .from("gastos")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            return NextResponse.json(
                { success: false, error: "Gasto no encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            gasto: data,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { success: false, error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}

// ===============================
// ELIMINAR GASTO
// ===============================

export async function DELETE(req: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        const { error } = await supabase
            .from("gastos")
            .delete()
            .eq("id", id);

        if (error) {
            console.error(error);

            return NextResponse.json(
                { success: false, error: "No se pudo eliminar el gasto" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Gasto eliminado correctamente",
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { success: false, error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}