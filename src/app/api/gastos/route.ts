import { supabase } from "@/src/utils/supabase";
import { NextRequest, NextResponse } from "next/server";
// ===============================
// CREAR GASTO
// ===============================

export async function POST(req: NextRequest) {

    try {
        const body = await req.json();
        const {
            monto,
            categoria,
            descripcion,
            fecha = new Date().toISOString(),
            tipo = "gasto",
        } = body;

        // ---------------------------
        // VALIDACIONES
        // ---------------------------

        if (monto === undefined || monto === null) {
            return NextResponse.json(
                { success: false, error: "El monto es obligatorio" },
                { status: 400 }
            );
        }

        if (!categoria) {
            return NextResponse.json(
                { success: false, error: "La categoría es obligatoria" },
                { status: 400 }
            );
        }

        const montoNumero = Number(monto);

        if (Number.isNaN(montoNumero) || montoNumero <= 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: "El monto debe ser un número mayor a 0",
                },
                { status: 400 }
            );
        }

        // ---------------------------
        // INSERTAR EN SUPABASE
        // ---------------------------

        const { data, error } = await supabase
            .from("gastos")
            .insert({
                monto: montoNumero,
                categoria: categoria,
                descripcion: descripcion || null,
                fecha: fecha || new Date().toISOString(),
                tipo: tipo || "gasto",
            })
            .select()
            .single();

        if (error) {
            console.error("Error Supabase:", error);

            return NextResponse.json(
                {
                    success: false,
                    error: "No se pudo guardar el gasto",
                    details: error.message,
                },
                { status: 500 }
            );
        }

        // ---------------------------
        // RESPUESTA
        // ---------------------------

        return NextResponse.json(
            {
                success: true,
                message: "Gasto guardado correctamente",
                gasto: data,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error inesperado:", error);

        return NextResponse.json(
            { success: false, error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}

// ===============================
// OBTENER GASTOS
// ===============================

export async function GET(req: NextRequest) {

    try {
        const { data, error } = await supabase
            .from("gastos")
            .select("*")
            .order("fecha", { ascending: false });

        if (error) {
            console.error(error);

            return NextResponse.json(
                {
                    success: false,
                    error: "No se pudieron obtener los gastos",
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            gastos: data,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { success: false, error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}