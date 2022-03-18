//función tipo para devolver mensaje de error en los datos recibidos desde la parte de back
export function errorMessage (errorMessage)
{
    var message =
    `<div class="container-sm align-top text-center">
        <p class="h3"><br>¡¡Oh oh!!</p>
            <picture>
                <img src="image/error.png" class="rounded img-fluid" alt="error"">
            </picture>
        <p class="h5"><br>${errorMessage}</p>
    </div>`;

    return message;
};