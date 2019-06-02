$(document).ready(function () {
    $("#grid_Fornecedores").kendoGrid({
        pageable: true,
        height: 550,
        columns: [
            {
                field: "Empresa.NomeFantasia",
                title: "Empresa",
                width: "120px"
            },
            {
                field: "Nome",
                title: "Nome",
                width: "200px",
            },
            {
                field: "CGC",
                title: "CPF/CNPJ",
                width: "120px"
            },
        ],
        dataSource: {
            transport: {
                read: "http://localhost:50676/Fornecedor/BuscarFornecedores",
            },
            dataType: 'json',
            pageSize: 20
        },
        editable: false,
        scrollable: true
    });

    $("#grid_Telefones").kendoGrid({
        columns: [
        {
            field: "Telefone",
            title: "Telefone"
        }
        ],
        height: 250, groupable: false, sortable: false, filterable: false,
        pageable: {
            refresh: true,
            pageSizes: true,
            buttonCount: 5
        }

    });

    $("#window_Fornecedor").kendoWindow({
        width: "610px",
        minWidth: "610px",
        maxWidth: "610px",
        height: "550px",
        minHeight: "550px",
        maxHeight:"550px",
        visible: false,
        modal: true,
        scrollable: true,
        actions: [
            "Close"
        ]
    }).data("kendoWindow");

    $("#window_Empresa").kendoWindow({
        width: "610px",
        minWidth: "610px",
        maxWidth: "610px",
        height: "210px",
        visible: false,
        modal: true,
        scrollable: false,
        actions: [
            "Close"
        ]
    }).data("kendoWindow");


    $("#btn_SalvarFornecedor").kendoButton({
        click: validarCamposFornecedor
    });

    $("#btn_SalvarEmpresa").kendoButton({
        click: validarCamposEmpresa
    });
    
    $("#btn_NovoTelefone").kendoButton({
        click: salvarTelefone
    });
    
    $("#btn_Filtrar").kendoButton({
        click: filtrarFornecedores
    });
    $("#DataNascimento").kendoDatePicker({
        dateInput: true,
        format: "dd/MM/yyyy",
        value: kendo.date.today()
    });

    $("#DataInicialFiltro").kendoDatePicker({
        dateInput: true,
        format: "dd/MM/yyyy",
        value: kendo.date.today()
    });

    $("#DataFinalFiltro").kendoDatePicker({
        dateInput: true,
        format: "dd/MM/yyyy",
        value: kendo.date.today()
    });

    $("#Empresa").kendoDropDownList({
        dataTextField: "NomeFantasia",
        dataValueField: "EmpresaUID",
        optionLabel: "Select",
        dataSource: {
            transport: {
                read: {
                    dataType: "json",
                    url: "http://localhost:50676/Empresa/BuscarEmpresas",
                }
            }
        }
    });

    var datasourceUF = [
        { value: "AL" },
        { value: "AM" },
        { value: "AP" },
        { value: "BA" },
        { value: "CE" },
        { value: "DF" },
        { value: "ES" },
        { value: "GO" },
        { value: "MA" },
        { value: "MG" },
        { value: "MS" },
        { value: "MT" },
        { value: "PA" },
        { value: "PB" },
        { value: "PE" },
        { value: "PI" },
        { value: "PR" },
        { value: "RJ" },
        { value: "RN" },
        { value: "RO" },
        { value: "RR" },
        { value: "RS" },
        { value: "SC" },
        { value: "SE" },
        { value: "SP" },
        { value: "TO" }
    ];
    $('#CGCFiltro').on('keypress', function () {
        var regex = new RegExp("^[ 0-9àèìòùáéíóúâêîôûãõ\b]+$");
        var _this = this;
        // Curta pausa para esperar colar para completar
        setTimeout(function () {
            var texto = $(_this).val();
            if (!regex.test(texto)) {
                $(_this).val(texto.substring(0, (texto.length - 1)))
            }
        }, 100);
    }); 
    $("#UF").kendoDropDownList({
        dataTextField: "value",
        dataValueField: "value",
        optionLabel: "Select",
        dataSource: datasourceUF
    });

    $("#popupNotification").kendoNotification({
        autoHideAfter: 10000
    }).data("kendoNotification");

    $("#PF").click(function () {
        $("#PJ").prop('checked', false);
        $("#DivPF").show();
        $("#CGC").data("kendoMaskedTextBox").setOptions({ mask: "000.000.000-00" })
        $("#CGC").data("kendoMaskedTextBox").value("")
    });
    $("#PJ").click(function () {
        $("#PF").prop('checked', false);
        $("#DivPF").hide();
        $("#CGC").data("kendoMaskedTextBox").setOptions({ mask: "00.000.000/0000-00" })
        $("#CGC").data("kendoMaskedTextBox").value("")
        $("#RG").val("");
    });

    $("#Telefone").kendoMaskedTextBox({
        mask: "(99) 00000-0000"
    });
    $("#CGC").kendoMaskedTextBox({
        mask: "000.000.000-00"
    });
    $("#CNPJ").kendoMaskedTextBox({
        mask: "00.000.000/0000-00"
    });
    $("#RG").kendoMaskedTextBox({
        mask: "00.00.000"
    });
});

function novoFornecedor_Click() {
    limparFornecedor();
    $("#window_Fornecedor").data("kendoWindow").open().center().title("Novo Fornecedor");
}
function novaEmpresa_Click() {
    limparEmpresa();
    $("#window_Empresa").data("kendoWindow").open().center().title("Nova Empresa");

}
var dataSourceTelefone = [];
function salvarTelefone() {

    var telefone = {
        Telefone: $("#Telefone").data("kendoMaskedTextBox").value().replace(/[^\d]+/g, '')
    };

    dataSourceTelefone.push(telefone);
            
    $("#grid_Telefones").data("kendoGrid").setDataSource(dataSourceTelefone);
    $("#grid_Telefones").data("kendoGrid").dataSource.pageSize(5);
    $("#grid_Telefones").data("kendoGrid").dataSource.read();
    $("#Telefone").val("");
}

function salvarFornecedor() {
        var popupNotification = $("#popupNotification").data("kendoNotification");

        var grid_Telefones = $("#grid_Telefones").data("kendoGrid");

        var lista_Telefones = [];

        for (var i = 0; i < grid_Telefones.items().length; i++) {

            var TelefoneFornecedor = {
                Telefone: grid_Telefones.dataItems()[i].Telefone
            };

            lista_Telefones.push(TelefoneFornecedor);
        }

        fornecedor = {
            Nome: $("#Nome").val(),
            CGC: $("#CGC").data("kendoMaskedTextBox").value().replace(/[^\d]+/g, ''),
            TelefonesFornecedor: lista_Telefones,
            EmpresaUID: $("#Empresa").data("kendoDropDownList").value(),
            RG: $("#RG").val().replace(/[^\d]+/g, ''),
            DataNascimento: $("#DataNascimento").data("kendoDatePicker").value().toLocaleDateString("pt-BR")
        };

        $.ajax({
            type: "POST",
            url: "http://localhost:50676/Fornecedor/SalvarFornecedor",
            content: "application/json; charset=utf-8",
            dataType: "json",
            data: fornecedor,
            success: function (response) {
                if (response == "OK") {
                    $("#grid_Fornecedores").data("kendoGrid").dataSource.read()
                    popupNotification.setOptions({ autoHideAfter: 3000 });
                    popupNotification.show("Salvo com sucesso!", "success");   
                    $("#window_Fornecedor").data("kendoWindow").close();
                }
                else {
                    popupNotification.show("Ocorreu um erro, favor contatar o suporte", "error");  
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                
            }
        });

    
}


function salvarEmpresa() {

        var popupNotification = $("#popupNotification").data("kendoNotification");
        empresa = {
            NomeFantasia: $("#NomeFantasia").val(),
            CNPJ: $("#CNPJ").val(),
            UF: $("#UF").data("kendoDropDownList").value()
        }

        $.ajax({
            type: "POST",
            url: "http://localhost:50676/Empresa/SalvarEmpresa",
            content: "application/json; charset=utf-8",
            dataType: "json",
            data: empresa,
            success: function (response) {
                popupNotification.setOptions({ autoHideAfter: 3000 });
                popupNotification.show("Salvo com sucesso!", "success");
                $("#window_Empresa").data("kendoWindow").close();
                $("#Empresa").data("kendoDropDownList").dataSource.read();
            },
            error: function (xhr, textStatus, errorThrown) {
                popupNotification.show("Ocorreu um erro, favor contatar o suporte", "error");  
            }
        });
}
var list = [];
function limparFornecedor() {

    $("#Nome").val("");
    $("#Nome").removeClass("validRequiredFields");
    $("#CGC").val("");
    $("#CGC").removeClass("validRequiredFields");
    $("#RG").val("");
    $("#RG").removeClass("validRequiredFields");
    $("#Empresa").data("kendoDropDownList").value(null);
    DataNascimento: $("#DataNascimento").data("kendoDatePicker").value(new Date());
    dataSourceTelefone = [];
    $("#grid_Telefones").data("kendoGrid").setDataSource(null);
    $("#grid_Telefones").data("kendoGrid").refresh();

}

function limparEmpresa() {

    $("#NomeFantasia").val("");
    $("#UF").data("kendoDropDownList").value(null);
    $("#CNPJ").val("");
    $("#NomeFantasia").removeClass("validRequiredFields");
    $("#CNPJ").removeClass("validRequiredFields");


}

function validarCamposFornecedor() {
    var valido = true;
    var Nome = $("#Nome").val();
    var RG = $("#RG").data("kendoMaskedTextBox").value().replace(/[^\d]+/g, '');
    var CGC = $("#CGC").data("kendoMaskedTextBox").value().replace(/[^\d]+/g, '');
    var EmpresaUID = $("#Empresa").data("kendoDropDownList").value();
    var popupNotification = $("#popupNotification").data("kendoNotification");

    if (Nome == "") {
        valido = false;
        $("#Nome").addClass("validRequiredFields");
    }
    else {
        $("#Nome").removeClass("validRequiredFields");
    }

    if ($("#PF").prop("checked")) {
        if (RG == "") {
            valido = false;
            $("#RG").addClass("validRequiredFields");
        }
        else {
            $("#RG").removeClass("validRequiredFields");
        }
    }
 
    if (CGC == "") {
        valido = false;
        $("#CGC").addClass("validRequiredFields");
    }
    else {
        $("#CGC").removeClass("validRequiredFields");
    }
    if (EmpresaUID == "") {
        valido = false;
    }

    if (valido) {
        $.ajax({
            type: "GET",
            url: "http://localhost:50676/Empresa/BuscarEmpresaUID/?EmpresaUID=" + EmpresaUID,
            content: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.UF == "PR") {
                    var Hoje = new Date();
                    var AnoNascimento = $("#DataNascimento").data("kendoDatePicker").value();
                    var anos = Hoje.getFullYear() - AnoNascimento.getFullYear();
                    if (Hoje.getMonth() < AnoNascimento.getMonth()) {
                        anos--
                    }
                    else {
                        if (Hoje.getDate() < AnoNascimento.getDate()) {
                            anos--
                        }
                    }
                    if (anos < 18 && $("#PF").prop("checked")) {
                        valido = false;
                    }
                }
                if (valido) {
                    salvarFornecedor();
                }
                else {
                    popupNotification.show("Não será permitido o cadastro de fornecedores com menos de 18 anos de idade para empresas do estado do Paraná", "error");
                }
            },
            error: function (xhr, textStatus, errorThrown) {
            }
        });
    }
    else {
        popupNotification.show("Preencha todos os campos", "error");
    }
}

function validarCamposEmpresa() {
    var valido = true;
    var NomeFantasia = $("#NomeFantasia").val();
    var CNPJ = $("#CNPJ").data("kendoMaskedTextBox").value().replace(/[^\d]+/g, '');
    var popupNotification = $("#popupNotification").data("kendoNotification");

    if (NomeFantasia == "") {
        valido = false;
        $("#NomeFantasia").addClass("validRequiredFields");
    }
    else {
        $("#NomeFantasia").removeClass("validRequiredFields");
    }
    if (CNPJ == "") {
        valido = false;
        $("#CNPJ").addClass("validRequiredFields");
    }
    else {
        $("#CNPJ").removeClass("validRequiredFields");
    }
    if (valido) {
        salvarEmpresa();
    }
    else {
        popupNotification.show("Preencha todos os campos", "error");
    }
    return valido;

}

function filtrarFornecedores() {
    var DataInicial = $("#DataInicialFiltro").data("kendoDatePicker").value().toLocaleString("pt-BR");
    var DataFinal = $("#DataFinalFiltro").data("kendoDatePicker").value().toLocaleString("pt-BR");
    var CGC = $("#CGCFiltro").val();
    var Nome = $("#NomeFiltro").val();
    var popupNotification = $("#popupNotification").data("kendoNotification");
    if ($("#DataInicialFiltro").data("kendoDatePicker").value().getTime() > $("#DataFinalFiltro").data("kendoDatePicker").value().getTime()) {

        popupNotification.show("Data inicial maior que a final", "error");
        valido = false;
    }
    else {
        
        $.ajax({
            type: "GET",
            url: "http://localhost:50676/Fornecedor/FiltroFornecedores/?CGC=" + CGC + "&Nome=" + Nome + "&DataInicial=" + DataInicial + "&DataFinal=" + DataFinal,
            content: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $("#grid_Fornecedores").data("kendoGrid").setDataSource(response);
                $("#grid_Fornecedores").data("kendoGrid").dataSource.read();
                $("#grid_Fornecedores").data("kendoGrid").dataSource.pageSize(20);
            },
            error: function (xhr, textStatus, errorThrown) {
            }
        });
    }
}





