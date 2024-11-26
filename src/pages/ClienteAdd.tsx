import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  import { Label } from "@radix-ui/react-label";
  import { Input } from "@/components/ui/input";
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
  

const ClienteAdd = () => {
    return(
        <div>
        <h2>agregar nuevo cliente</h2>

        <div>

        <form>
        <Card>
  <CardHeader>
    <CardTitle>Agregar nuevo cliente</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
  
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="nombre">Nombre</Label>
              <Input type="text" name="nombre" placeholder="Nombre" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="apellido">Apellido</Label>
              <Input type="text" name="apellido" placeholder="Apellido" />
            </div>





            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Ejecutivo</Label>
              <Select>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Seleccione ejecutivo" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="next">Ejecutivo 1</SelectItem>
                  <SelectItem value="sveltekit">Ejecutivo 2</SelectItem>
                  <SelectItem value="astro">Ejecutivo 3</SelectItem>
                  <SelectItem value="nuxt">Ejecutivo 4</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        
  </CardContent>
  <CardFooter className="flex justify-between">
    <Button variant="ghost">Cancelar</Button>
    <Button>Guardar</Button>
  </CardFooter>
</Card>
</form>
        </div>
        </div>

    )
}

export default ClienteAdd;