import net from "net"

const clientMap = new Map<string, net.Socket>()