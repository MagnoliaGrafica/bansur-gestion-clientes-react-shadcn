import { ResumenCanal } from "@/components/ResumenCanal";
import { ResumenSector } from "@/components/ResumenSector";
import { ResumenEstados } from "@/components/ResumenEstados";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";

const Dashboard = () => {
    return (
        <div>
            <h2 className="text-2xl font-medium text-bansur my-4">Dashboard Gestión Comercial</h2>
            <div className="grid grid-cols-3 gap-8">

            <section>
            <Card>
                <CardHeader>
                    <CardTitle>Resumen Canal</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResumenCanal />
                </CardContent>
                </Card>
            </section>
            <section>
            <Card>
                <CardHeader>
                    <CardTitle>Resumen Sector</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResumenSector />
                </CardContent>
                </Card>
            </section>
            <section>
            <Card>
                <CardHeader>
                    <CardTitle>Resumen Estados</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResumenEstados />
                </CardContent>
                </Card>
            </section>
            </div>       
        </div>
    );
};

export default Dashboard;