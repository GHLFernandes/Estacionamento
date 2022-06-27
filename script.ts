interface Veiculo{
    nome: string;
    placa: string;
    entrada: Date | string;
}

(function(){
    const $ = (query: string): HTMLInputElement | null => document.querySelector(query);

    function calcTempo(mils: number){
        const min = Math.floor(mils / 60000);
        const sec = Math.floor((mils % 60000) / 1000);

        return `${min}m e ${sec}s`;
    }

    function patio(){
        function ler(): Veiculo[]{

            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }
        
        function salvar(veiculos: Veiculo[]){
            localStorage.setItem('patio', JSON.stringify(veiculos));
        }

        function add(veiculo: Veiculo, salva?: boolean) {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${veiculo.nome}</td>
                <td>${veiculo.placa}</td>
                <td>${veiculo.entrada}</td>
                <td>
                    <button class='delete' data-placa='${veiculo.placa}'>X</button>
                </td>
            `;

            row.querySelector('.delete')?.addEventListener('click', function(){
                del(this.dataset.placa)
            });

            $('#patio')?.appendChild(row);
            if(salva) salvar([...ler(), veiculo]);
        }

        function del(placa: string){
            const { entrada, nome } = ler().find(veiculo => veiculo.placa === placa);

            const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime());

            if(!confirm(`O veiculo ${nome} permaneceu por ${tempo}. Deseja encerrar? `)) return;

            salvar(ler().filter(veiculo => veiculo.placa !== placa));

            render();
        }


        function render(){
            $('#patio')!.innerHTML = '';

            const patio = ler();

            if(patio.length){
                patio.forEach((veiculo) => {
                    add(veiculo);
                });
            }
        }

        return{
            ler, add, del, salvar, render
        };
    }
    patio().render(); 

    $('#cadastrar')?.addEventListener('click', () => {
        const nome = $('#nome')?.value;
        const placa = $('#placa')?.value;

        if(!nome || !placa) return alert('O nome e plca sao obrigatorios')

        patio().add({nome, placa, entrada: new Date().toISOString()}, true);

        $('#nome').value = '';
        $('#placa').value = '';
    });
})()