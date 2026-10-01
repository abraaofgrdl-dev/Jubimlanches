import React from 'react';
import { Order, DailySalesSummary } from '../../types';
import { RESTAURANT_INFO } from '../../data/menu';

interface ThermalReceiptProps {
  order?: Order | null;
  dailySummary?: DailySalesSummary | null;
  mode: 'order' | 'daily_report';
}

export const ThermalReceipt: React.FC<ThermalReceiptProps> = ({
  order,
  dailySummary,
  mode,
}) => {
  if (mode === 'daily_report' && dailySummary) {
    const todayFormatted = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <div id="thermal-print-area" className="hidden print:block print:text-black font-mono text-[13px] leading-tight max-w-[80mm] mx-auto p-2 bg-white">
        <div className="text-center font-bold text-base mb-1">
          ★ JUBIM LANCHES ★
        </div>
        <div className="text-center text-xs">HAMBÚRGUERES & ESPECIAIS</div>
        <div className="text-center text-xs">{RESTAURANT_INFO.address} · {RESTAURANT_INFO.phone}</div>
        <div className="my-2 border-t border-b border-black py-1 text-center font-bold text-sm">
          FECHAMENTO DIÁRIO DE CAIXA
        </div>
        <div className="text-xs mb-2">Emissão: {todayFormatted}</div>

        <div className="space-y-1 mb-2">
          <div className="flex justify-between">
            <span>Total de Pedidos:</span>
            <span className="font-bold">{dailySummary.totalOrders}</span>
          </div>
          <div className="flex justify-between">
            <span>Burgers Vendidos:</span>
            <span className="font-bold">{dailySummary.totalBurgersSold} un</span>
          </div>
          <div className="flex justify-between">
            <span>Ticket Médio:</span>
            <span className="font-bold">R$ {dailySummary.averageTicket.toFixed(2)}</span>
          </div>
        </div>

        <div className="border-t border-dashed border-black my-2 pt-1 font-bold text-xs uppercase">
          Faturamento por Pagamento:
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span>PIX:</span>
            <span>R$ {dailySummary.byPayment.pix.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Cartão (Déb/Créd):</span>
            <span>R$ {dailySummary.byPayment.cartao.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Dinheiro em Espécie:</span>
            <span>R$ {dailySummary.byPayment.dinheiro.toFixed(2)}</span>
          </div>
        </div>

        <div className="border-t border-b border-black my-2 py-1 flex justify-between font-bold text-sm">
          <span>FATURAMENTO TOTAL:</span>
          <span>R$ {dailySummary.totalRevenue.toFixed(2)}</span>
        </div>

        <div className="border-b border-dashed border-black pb-1 mb-2 font-bold text-xs uppercase">
          Top Hambúrgueres Vendidos:
        </div>
        <div className="space-y-1 text-xs mb-4">
          {dailySummary.topItems.map((item, idx) => (
            <div key={idx} className="flex justify-between">
              <span>{item.quantity}x {item.name}</span>
              <span>R$ {item.revenue.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-black text-center text-xs">
          Assinatura do Responsável
        </div>
      </div>
    );
  }

  if (!order) return null;

  const dateFormatted = new Date(order.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div id="thermal-print-area" className="hidden print:block print:text-black font-mono text-[13px] leading-tight max-w-[80mm] mx-auto p-2 bg-white">
      {/* Header */}
      <div className="text-center font-bold text-base tracking-wider mb-1">
        ★ JUBIM LANCHES ★
      </div>
      <div className="text-center text-xs">HAMBÚRGUERES & ESPECIAIS</div>
      <div className="text-center text-xs">{RESTAURANT_INFO.address} · {RESTAURANT_INFO.phone}</div>
      <div className="text-center text-xs text-neutral-600 mt-0.5">================================</div>

      {/* Order Badge */}
      <div className="text-center font-bold text-xl my-1">
        PEDIDO #{order.orderNumber}
      </div>
      <div className="text-center font-bold text-sm uppercase py-1 border-t border-b border-black">
        *** {order.deliveryType === 'delivery' ? 'ENTREGA (DELIVERY)' : 'RETIRADA NO BALCÃO'} ***
      </div>
      <div className="text-xs my-1 flex justify-between">
        <span>Data: {dateFormatted}</span>
        <span className="font-bold uppercase">Status: {order.status}</span>
      </div>

      <div className="text-center text-xs text-neutral-600">--------------------------------</div>

      {/* Customer Info */}
      <div className="text-xs space-y-0.5 my-1">
        <div><span className="font-bold">Cliente:</span> {order.customerName}</div>
        {order.customerPhone && (
          <div><span className="font-bold">Tel:</span> {order.customerPhone}</div>
        )}
        {order.deliveryType === 'delivery' && (
          <div className="mt-1 p-1 border border-black font-bold">
            Endereço: {order.deliveryAddress || 'Não informado'}
          </div>
        )}
      </div>

      <div className="text-center text-xs text-neutral-600">--------------------------------</div>

      {/* Items List */}
      <div className="font-bold text-xs uppercase mb-1">ITENS DO PEDIDO:</div>
      <div className="space-y-2 mb-2">
        {order.items.map((it, idx) => (
          <div key={idx} className="text-xs">
            <div className="flex justify-between font-bold">
              <span>{it.quantity}x {it.name}</span>
              <span>R$ {(it.quantity * it.unitPrice).toFixed(2)}</span>
            </div>
            {it.notes && (
              <div className="text-[11px] font-bold italic pl-3 text-neutral-800">
                &gt;&gt; OBS: {it.notes}
              </div>
            )}
          </div>
        ))}
      </div>

      {order.notes && (
        <div className="my-2 p-1 border border-dashed border-black text-xs">
          <span className="font-bold">OBS GERAL:</span> {order.notes}
        </div>
      )}

      <div className="text-center text-xs text-neutral-600">--------------------------------</div>

      {/* Totals */}
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>R$ {order.subtotal.toFixed(2)}</span>
        </div>
        {order.deliveryType === 'delivery' && (
          <div className="flex justify-between">
            <span>Taxa de Entrega:</span>
            <span>R$ {order.deliveryFee.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-base border-t border-black pt-1">
          <span>TOTAL:</span>
          <span>R$ {order.total.toFixed(2)}</span>
        </div>
      </div>

      <div className="text-center text-xs text-neutral-600 my-1">--------------------------------</div>

      <div className="text-xs flex justify-between uppercase">
        <span className="font-bold">Pagamento:</span>
        <span className="font-bold">{order.paymentMethod}</span>
      </div>

      <div className="text-center text-xs text-neutral-600 my-1">================================</div>
      <div className="text-center text-[11px] italic mt-2">
        Obrigado pela preferência! Bom apetite!
      </div>
      <div className="text-center text-[10px] mt-1">
        Jubim Lanches - Jubim, Pará · Sistema de Gestão
      </div>
    </div>
  );
};
